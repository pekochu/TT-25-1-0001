/* eslint-disable @typescript-eslint/ban-ts-comment */
import {Express, Request, Response, NextFunction} from 'express';
import logger from '../util/logger';
import WebdriverInstances from './instances-webdriver';
import { Options } from 'selenium-webdriver/chrome';
import { Builder, Capabilities } from 'selenium-webdriver';

// Your custom "middleware" function:
export default async function createWebDriverInstancePerSession(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if(!req.session.browserId){
      if(!WebdriverInstances.has(req.session.id)){
        const chromeOptions = new Options();
        chromeOptions.headless();
        chromeOptions.windowSize({width: 1440, height: 1080});
        const chromeCapabilities = Capabilities.chrome();
        const driver = new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).withCapabilities(chromeCapabilities).build();
        const browser = await driver;
        req.session.browserId = (await browser.getSession()).getId();
        logger.info(`Browser launched with id: ${req.session.browserId}`);
        
        WebdriverInstances.set(req.session.id, browser);
      }
    } else {
      logger.info(`BrowserId: ${req.session.browserId}`);
    }
    next();
  } catch (error) {
    next(error);
  }
  
}