'use strict';

import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import * as yup from 'yup';
import { Response, Request, NextFunction } from 'express';
import WebdriverInstances from '@project/server/webdriver/instances-webdriver';
import CaptureSnapshot from '@project/server/webdriver/CaptureSnapshot';
import { validationResult, check } from 'express-validator';
import logger from '@project/server/app/util/logger';
import { SCREENSHOTS_DIR } from '@project/server/app/util/constants';
import { InternalServerError } from '@project/server/app/util/apierror';
import { PNG } from 'pngjs';
import { BASEIMAGE_DIR } from '@project/server/app/util/constants';
import GenerateXpathExpression from '../webdriver/GenerateXpathExpression';


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

  res.json({ sessionId: req.sessionID, session: req.session });
};

export const goToUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
    await check('url', 'Campo URL no puede estar en blanco').not().isEmpty().run(req);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.flash('errors', errors.array());
      res.status(401).send({ statusCode: 401, errors: errors.array() });
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

export const getElementScreenshot = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
    const elementsSchema = yup.object().shape({
      elementAncestor: yup.number().default(0),
      elementId: yup.string().required('Se requiere el elementId'),
      selector: yup.string().required(),
      alias: yup.string().required()
    });

    await elementsSchema.validate(req.body, { abortEarly: true });
    const foundElements = elementsSchema.cast(req.body);
    const webDriverInstance = WebdriverInstances.get(req.session.id);
    if(!webDriverInstance) {
      throw new InternalServerError('El navegador no fue inicializado');
    }   
    const browser = webDriverInstance.browser as WebdriverIO.Browser;
    const xpath = `${foundElements.selector}${'/..'.repeat(foundElements.elementAncestor)}`;
    const specificElement = await browser.$(xpath);
    const takenScreenshot = await browser.takeElementScreenshot(specificElement.elementId, true);  
    const img = Buffer.from(takenScreenshot, 'base64');
    res.writeHead(200, {
      'x-escomonitor-xpath': xpath,
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
    res.send({ title: title });
  } catch(error){
    next(error);
  }
};

export const getElementsByNameOrXpath = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
    const schema = yup.object().shape({
      query: yup.string().required('Por favor, introduce una expresión XPATH o cualquier otro string')
    });

    await schema.validate(req.body, { abortEarly: true });
    const webDriverInstance = WebdriverInstances.get(req.session.id);
    if(!webDriverInstance) {
      throw new InternalServerError('El navegador no fue inicializado');
    }   
    const browser = webDriverInstance.browser as WebdriverIO.Browser;
    const isXpathValid = (await browser.$$(req.body.query as string)).length > 0;
    let selectorAlias: string;
    const xpath = [];
    if(isXpathValid){
      xpath.push(req.body.query);
      selectorAlias = req.body.query;
    } else {
      const generateXpathExpression = new GenerateXpathExpression(browser);
      selectorAlias = `//*[name(.) and contains(text(), '${req.body.query}')]`;
      const elements = await browser.$$(selectorAlias);
      console.log(`Elementos encontrados inicialmente: ${elements.length}`);
      for(const element of elements){
        const xpathResult = await generateXpathExpression.getXpath(element);
        xpath.push(xpathResult);   
      }
    }

    const finalElements = [];
    for(const selector of xpath){
      const elements = await browser.$$(selector);
      if(elements.length > 5) continue;
      for(let i = 0; i < elements.length; i++){
        const elementRect = await browser.getElementRect(elements[i].elementId);
        const elementTagName = await elements[i].getTagName();
        const elementInnerText = await elements[i].getText();        
        (elements[i] as any).rect = elementRect;
        (elements[i] as any).alias = selectorAlias;
        if(elementRect.height > 0 && elementRect.width > 0) {
          const betterXpath = `//*[name(.) = '${elementTagName}' and contains(text(), '${elementInnerText}')]`;
          const testBetterXpath = await browser.$$(betterXpath);
          console.log(betterXpath);
          if(testBetterXpath.length == 1) (elements[i] as any).selector = betterXpath;
          finalElements.push(elements[i]);
        }      
      }
    }
    
    res.send({ elements: finalElements });
  } catch(error){
    next(error);
  }
};

export const getAllVisibleInputs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
    const selector = `//input`;
    const webDriverInstance = WebdriverInstances.get(req.session.id);
    if(!webDriverInstance) {
      throw new InternalServerError('El navegador no fue inicializado');
    }   
    const browser = webDriverInstance.browser as WebdriverIO.Browser;

    const finalElements = [];
    const elements = await browser.$$(selector);
    for(let i = 0; i < elements.length; i++){
      const elementRect = await browser.getElementRect(elements[i].elementId);
      const elementTagName = await elements[i].getTagName();
      const elementInputName = await elements[i].getAttribute('name');
      (elements[i] as any).rect = elementRect;
      (elements[i] as any).selector = `//${elementTagName}[@name='${elementInputName}']`;
      (elements[i] as any).alias = selector;
      if(elementRect.height > 0 && elementRect.width > 0) {
        finalElements.push(elements[i]);
      }      
    }
    
    res.send({ elements: finalElements });
  } catch(error){
    next(error);
  }
};

export const pointAtElement = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
    const schema = yup.object().shape({
      coordX: yup.number().required('Por favor, introduce una coordenada X'),
      coordY: yup.number().required('Por favor, introduce una coordenada Y')
    });

    await schema.validate(req.body, { abortEarly: true });
    const webDriverInstance = WebdriverInstances.get(req.session.id);
    if(!webDriverInstance) {
      throw new InternalServerError('El navegador no fue inicializado');
    }   
    const browser = webDriverInstance.browser as WebdriverIO.Browser;
    await (await browser.$('body')).moveTo({ xOffset: req.body.coordX, yOffset: req.body.coordY });
    const elements = await browser.$$(':hover');
    res.send({ elements: elements });
  } catch(error){
    next(error);
  }
};


