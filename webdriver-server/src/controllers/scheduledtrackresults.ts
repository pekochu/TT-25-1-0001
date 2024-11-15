'use strict';

import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import * as yup from 'yup';
import logger from '@project/server/app/util/logger';
import { Response, Request, NextFunction } from 'express';
import { ValidationError, BadRequestError, InternalServerError } from '@project/server/app/util/apierror';
import { validationResult, check } from 'express-validator';
import { SCREENSHOTS_DIR, BASEIMAGE_DIR } from '@project/server/app/util/constants';
import { CreatePagesToTrackDTO } from '@project/server/app/dto/pagestotrack.dto';
import * as PagesToTrackService from '@project/server/app/database/services/PagesToTrackService';
import * as ScheduledTrackingResultsService from '@project/server/app/database/services/ScheduledTrackingResultsService';
import { CreationAttributes, Op } from 'sequelize';
import { PagesToTrack, ScheduledTrackingResults } from '@project/server/app/models';

export const getResultsByPage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
    const schema = yup.object().shape({
      pageId: yup.number().required('pageId requerido')
    });
    await schema.validate(req.params, { abortEarly: true });
    const params = req.params;

    const result = await PagesToTrackService.getByIdWithResults(parseInt(params.pageId));
    if(!result) {
      throw (new BadRequestError('Error al obtener resultados'));
    } else {
      res.status(200).send({ success: true, statusCode: 200, data: result });
    }
  } catch(error){
    next(error);
  }
  
};

export const getBaseImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
    const schema = yup.object().shape({
      resultId: yup.number().required('resultId requerido')
    });
    await schema.validate(req.params, { abortEarly: true });
    const params = req.params;

    const result = await ScheduledTrackingResultsService.getScreenshotsById(parseInt(params.resultId));
    if(!(result as any).resultsPage){
      throw (new InternalServerError('No se pudo extraer el imageBasePath de la página asociada a este resultado\n'));
    }
    const img = fs.readFileSync((result as any).resultsPage.imageBasePath, {flag: 'r',});
    res.writeHead(200, {
      'x-escomonitor-image-path': (result as any).resultsPage.imageBasePath,
      'Content-Type': 'image/png',
      'Content-Length': img.length
    });
    res.end(img);
     
  } catch(error){
    logger.error(`[Screenshot] Error: ${error}`);
    next(error);
  }
};

export const getNewImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
    const schema = yup.object().shape({
      resultId: yup.number().required('resultId requerido')
    });
    await schema.validate(req.params, { abortEarly: true });
    const params = req.params;

    const result = await ScheduledTrackingResultsService.getScreenshotsById(parseInt(params.resultId));
    logger.info(result);
    if(!result.imageChequeoPath){
      throw (new InternalServerError('No se pudo extraer el imageChequeoPath del resultado\n'));
    }
    const img = fs.readFileSync(result.imageChequeoPath, {flag: 'r',});
    res.writeHead(200, {
      'x-escomonitor-image-path': result.imageChequeoPath,
      'Content-Type': 'image/png',
      'Content-Length': img.length
    });
    res.end(img);
     
  } catch(error){
    logger.error(`[Screenshot] Error: ${error}`);
    next(error);
  }
};

export const getDifferenceImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
    const schema = yup.object().shape({
      resultId: yup.number().required('resultId requerido')
    });
    await schema.validate(req.params, { abortEarly: true });
    const params = req.params;

    const result = await ScheduledTrackingResultsService.getScreenshotsById(parseInt(params.resultId));
    logger.info(result);
    if(!result.imageDiferenciaPath){
      throw (new InternalServerError('No se pudo extraer el imageDiferenciaPath del resultado\n'));
    }
    const img = fs.readFileSync(result.imageDiferenciaPath, {flag: 'r',});
    res.writeHead(200, {
      'x-escomonitor-image-path': result.imageDiferenciaPath,
      'Content-Type': 'image/png',
      'Content-Length': img.length
    });
    res.end(img);
     
  } catch(error){
    logger.error(`[Screenshot] Error: ${error}`);
    next(error);
  }
};