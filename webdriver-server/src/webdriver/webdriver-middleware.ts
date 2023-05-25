/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Express, Request, Response, NextFunction } from 'express';
import { remote } from 'webdriverio';
import browserConfig from '@project/server/webdriver/browser';
import logger from '@project/server/app/util/logger';
import WebdriverInstances, { WebDriverObject } from '@project/server/webdriver/instances-webdriver';


// Your custom "middleware" function:
export default async function createWebDriverInstancePerSession(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if(!WebdriverInstances.has(req.session.id)){
      const browser = await remote(browserConfig);
      req.session.browserId = await browser.sessionId;
      logger.info(`Nuevo navegador creado: ${req.session.browserId}`);
      // Registrar instancia en el diccionario
      const browserObject: WebDriverObject = {
        browserId: req.session.browserId,
        browser: browser,
        expires: Date.now()
      };
      WebdriverInstances.set(req.session.id, browserObject);
    } else {
      const webDriverObject = WebdriverInstances.get(req.session.id);
      if(webDriverObject){
        // Renovar sesion del navegador
        webDriverObject.expires = Date.now();
      }
    }
    next();
  } catch (error) {
    next(error);
  }
  
}