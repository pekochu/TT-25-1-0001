/* eslint-disable @typescript-eslint/ban-ts-comment */
import {Express, Request, Response, NextFunction} from 'express';
import { remote } from 'webdriverio';
import browserConfig from './browser';
import logger from '../util/logger';
import WebdriverInstances from './instances-webdriver';


// Your custom "middleware" function:
export default async function createWebDriverInstancePerSession(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if(!req.session.browserId){
      if(!WebdriverInstances.has(req.session.id)){
        const browser = await remote({
          capabilities: {
            browserName: 'chrome',
            'goog:chromeOptions': {
              args: ['no-sandbox', 'disable-gpu', 'headless', 'disable-dev-shm-usage', 'disable-notifications', 'window-size=1440,1080', '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.5 Safari/605.1.15"'],
            },
          },
          logLevel: 'silent',
        });
        req.session.browserId = await browser.sessionId;
        logger.info(`Browser launched with id: ${req.session.browserId}`);
        // Registrar instancia en el diccionario
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