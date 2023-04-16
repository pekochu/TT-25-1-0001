'use strict';

import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { Response, Request, NextFunction } from 'express';
import globalRemote from '@project/server/webdriver/browser';
import WebdriverInstances from '@project/server/webdriver/instances-webdriver';
import { WebDriver } from 'selenium-webdriver';
import apierror from '@project/server/app/util/apierror';
import { validationResult, check } from 'express-validator';
import logger from '../util/logger';


/**
 * List of API examples.
 * @route GET /api
 */
export const getApi = async (req: Request, res: Response): Promise<void> => {
  res.json('Hello World!');
  const browser = await globalRemote;
  await browser.url('google.com.mx');    
};

export const getIp = async (req: Request, res: Response): Promise<void> => {
  const browser = await globalRemote;
  await browser.url('https://ipinfo.io/json');    
  const content = await browser.$('pre').getText();
  const obj = JSON.parse(content);
  res.json({ip: obj.ip});
};

export const testSession = async (req: Request, res: Response): Promise<void> => {
  let counter = 0;
  if(!req.session.pageViews){
    req.session.pageViews = 1;
  } else {
    req.session.pageViews++;
  }
  counter = req.session.pageViews;
  res.json({sessionId: req.sessionID, browserId: req.session.browserId, counter: counter, session: req.session});
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
    const url = req.query.url;
    const browser = WebdriverInstances.get(req.session.id) as WebDriver;
    await browser.get(url as string);   
    res.json('OK');
  } catch(error){
    next(error);
  }
  
};
export const getScreenshot = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
    const browser = WebdriverInstances.get(req.session.id) as WebDriver;
    // const image = await registerImageComparisonService(browser);
    const data = await browser.takeScreenshot();  
    
    const img = Buffer.from(data, 'base64');
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
