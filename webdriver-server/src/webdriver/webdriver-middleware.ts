/* eslint-disable @typescript-eslint/ban-ts-comment */
import {Express, Request, Response, NextFunction} from 'express';
import { remote } from 'webdriverio';
import browserConfig from '@project/server/webdriver/browser';
import logger from '@project/server/app/util/logger';
import WebdriverInstances from '@project/server/webdriver/instances-webdriver';


// Your custom "middleware" function:
export default async function createWebDriverInstancePerSession(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if(!req.session.browserId){
      if(!WebdriverInstances.has(req.session.id)){
        const browser = await remote(browserConfig);
        req.session.browserId = await browser.sessionId;
        logger.info(`New session created: ${req.session.browserId}`);
        logger.info(`${req.session.browserId} from ${req.url}`);
        // Registrar instancia en el diccionario
        WebdriverInstances.set(req.session.id, browser);
      }
    } else {
      logger.info(`${req.session.browserId} from ${req.url}`);
    }
    next();
  } catch (error) {
    next(error);
  }
  
}