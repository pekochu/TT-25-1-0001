import { ChainablePromiseElement, Mock } from 'webdriverio';
import logger from '../util/logger';


class CaptureSnapshot {

  // Interceptor variables
  private browser: WebdriverIO.Browser;
  private readonly injectLibScript = `
  (function(d, script) {
      script = d.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.onload = function(){
          // remote script has loaded
      };
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      d.getElementsByTagName('head')[0].appendChild(script);
  }(document));`;
  private readonly genImageScript = `  
      html2canvas(document.body).then(canvas => {
        var myImage = canvas.toDataURL("image/png");
        return myImage;
      });`;

  constructor(browser: WebdriverIO.Browser) {
    this.browser = browser;
  }

  public getImage = async (): Promise<Buffer> => {
    await this.browser.pause(1000);
    let scriptExecutionResult = await this.browser.executeScript(this.injectLibScript, []);
    await this.browser.pause(500);
    scriptExecutionResult = await this.browser.executeScript(this.genImageScript, []);
    if (scriptExecutionResult) {
      // attach report
      const decodedImage = Buffer.from(
        scriptExecutionResult.replace(/^data:image\/(png|gif|jpeg);base64,/, ''),
        'base64'
      );
      return decodedImage;
    }

    return Buffer.alloc(0);
  }

  public getDevtoolsImage = async (): Promise<Buffer> => {
    const puppeteer = (await this.browser.getPuppeteer());
    const pages = await puppeteer.pages();
    return pages[0].screenshot({fullPage: true});
  }
}

export default CaptureSnapshot;
