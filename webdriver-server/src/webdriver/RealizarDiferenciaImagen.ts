import { ChainablePromiseElement, Mock } from 'webdriverio';
import logger from '../util/logger';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

export function fixPngImage(image: PNG, width: number, height: number): PNG {
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
export default class RealizarDiferenciaImagen {

  private imagenBase: PNG;
  private imagenActual: PNG;
  private outputHeight = 0;
  private outputWidth = 0;
  private porcentajeDiferencia = 0;

  constructor(imagenBase: PNG, imagenActual: PNG) {
    this.imagenBase = imagenBase;
    this.imagenActual = imagenActual;
  }

  public ejecutar = async (): Promise<PNG> => {
    const outputImage = new PNG({
      width: Math.max(this.imagenBase.width, this.imagenActual.width),
      height: Math.max(this.imagenBase.height, this.imagenActual.height),
    });

    const imagenBaseFix = await fixPngImage(this.imagenBase, outputImage.width, outputImage.height);
    const imagenActualFix = await fixPngImage(this.imagenActual, outputImage.width, outputImage.height);
    this.outputHeight = outputImage.height;
    this.outputWidth = outputImage.width;

    const options = { threshold: 0.1, diffMask: false };
    const result = pixelmatch(imagenBaseFix.data, imagenActualFix.data, outputImage.data, outputImage.width, outputImage.height, options);
    this.porcentajeDiferencia = result;
    return outputImage;
  }

  public getPorcentajeDiferencia = async (): Promise<number> => {
    return Math.round(100 * 100 * this.porcentajeDiferencia / (this.outputWidth * this.outputHeight)) / 100;
  }

}

