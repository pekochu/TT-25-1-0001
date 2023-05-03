'use strict';

import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { Response, Request, NextFunction } from 'express';
import WebdriverInstances from '@project/server/webdriver/instances-webdriver';
import CaptureSnapshot from '@project/server/webdriver/CaptureSnapshot';
import { validationResult, check } from 'express-validator';
import logger from '@project/server/app/util/logger';
import { SCREENSHOTS_DIR } from '@project/server/app/util/constants';
import { InternalServerError } from '@project/server/app/util/apierror';


/**
 * List of API examples.
 * @route GET /api
 */
export const getApi = async (req: Request, res: Response): Promise<void> => {
  res.json({ title: 'TT Monitor :)' });   
};

export const testSession = async (req: Request, res: Response): Promise<void> => {  
  if(!req.session.pageViews){
    req.session.pageViews = 1;
  } else {
    req.session.pageViews++;
  }

  res.json({sessionId: req.sessionID, session: req.session});
};

export const goToUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
    await check('url', 'Campo URL no puede estar en blanco').not().isEmpty().run(req);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.flash('errors', errors.array());
      res.status(401).send({ statusCode: 401, errors: errors.array()});
      return;
    }
    const webDriverInstance = WebdriverInstances.get(req.session.id);
    if(!webDriverInstance) {
      throw new InternalServerError('El navegador no fue inicializado');
    }    

    const url = req.query.url;
    const browser = webDriverInstance.browser as WebdriverIO.Browser;
    await browser.url(url as string);   
    await browser.waitUntil(
      () => browser.execute(() => document.readyState === 'complete'),
      {
        timeout: 20 * 1000, // 20 segundos
        timeoutMsg: 'Error al cargar sitio web'
      }
    );
    res.json('OK');
  } catch(error){
    next(error);
  }
  
};
export const getScreenshot = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
    const webDriverInstance = WebdriverInstances.get(req.session.id);
    if(!webDriverInstance) {
      throw new InternalServerError('El navegador no fue inicializado');
    }   
    const browser = webDriverInstance.browser as WebdriverIO.Browser;
    const captureSnapshot = new CaptureSnapshot(browser);
    const img = await captureSnapshot.getDevtoolsImage();    
    fs.writeFileSync(path.join(SCREENSHOTS_DIR, `${req.session.browserId}-screenshot.png`), img, {});
    res.writeHead(200, {
      'browser-id': req.session.browserId,
      'Content-Type': 'image/png',
      'Content-Length': img.length
    });
    res.end(img);
     
  } catch(error){
    next(error);
  }
};

export const getTitlePage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
    const webDriverInstance = WebdriverInstances.get(req.session.id);
    if(!webDriverInstance) {
      throw new InternalServerError('El navegador no fue inicializado');
    }   
    const browser = webDriverInstance.browser as WebdriverIO.Browser;
    const title = await browser.getTitle();
    res.send({title: title});
  } catch(error){
    next(error);
  }
};
