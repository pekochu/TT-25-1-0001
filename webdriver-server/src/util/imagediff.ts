import fs from 'fs';
import path from 'path';
import logger from '@project/server/app/util/logger';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { SCREENSHOTS_DIR } from '@project/server/app/util/constants';
  
function fixPngImage(image: PNG, width: number, height: number): PNG {
  if (image.width !== width || image.height !== height) {
    const fixedImage = new PNG({
      width,
      height,
      inputHasAlpha: true,
    });
  
    PNG.bitblt(image, fixedImage, 0, 0, image.width, image.height, 0, 0);
    return fixedImage;
  }
  return image;
}
  
export class ImageDiff {

    private width: number;
    private height: number;
    private differences: number;
    private threshold: number;
    constructor(threshold: number) {
      this.width = 0;
      this.height = 0;
      this.differences = 0;
      this.threshold = threshold;
    }
  
    async run(callback: ((object: any) => void)): Promise<void> {
      const aImage = await readPngImage(this.options.imageAPath);
      const bImage = await readPngImage(this.options.imageBPath);
  
      const dstImage = new PNG({
        width: Math.max(aImage.width, bImage.width),
        height: Math.max(aImage.height, bImage.height),
      });
  
      const aCanvas = await fixPngImage(aImage, dstImage.width, dstImage.height);
      const bCanvas = await fixPngImage(bImage, dstImage.width, dstImage.height);
  
      const options = { threshold: 0.1, diffMask: true };
      const result = pixelmatch(aCanvas.data, bCanvas.data, dstImage.data, dstImage.width, dstImage.height, options);
  
      dstImage.pack().pipe(fs.createWriteStream(this.getImageOutput()));
  
      callback(Object.assign(this, {
        width: dstImage.width,
        height: dstImage.height,
        differences: result,
      }));
    }
  
    getImageOutput() {
      return this.options.imageOutputPath;
    }
  
    getDifference() {
      // eslint-disable-next-line no-mixed-operators
      return Math.round(100 * 100 * this.differences / (this.width * this.height)) / 100;
    }
  
    hasPassed() {
      const percentage = this.getDifference();
      return percentage <= this.options.threshold;
    }
}
  