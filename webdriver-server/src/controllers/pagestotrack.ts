'use strict';

import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import * as yup from 'yup';
import logger from '@project/server/app/util/logger';
import { Response, Request, NextFunction } from 'express';
import { ValidationError, BadRequestError } from '@project/server/app/util/apierror';
import { validationResult, check } from 'express-validator';
import { SCREENSHOTS_DIR, BASEIMAGE_DIR } from '@project/server/app/util/constants';
import { CreatePagesToTrackDTO } from '@project/server/app/dto/pagestotrack.dto';
import * as PagesToTrackService from '@project/server/app/database/services/PagesToTrackService';
import { CreationAttributes, Op } from 'sequelize';
import { PagesToTrack, ScheduledTrackingResults } from '@project/server/app/models';

export const createPagesToTrack = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
    const schema = yup.object().shape({
      url: yup.string().required('Por favor, introduce una URL'),
      descripcion: yup.string().required('Por favor, introduce una descripición para la página'),
      frecuencia: yup.number().required('Por favor, introduce la frecuencia'),
      diferenciaAlerta: yup.number().required('Requerimos de un porcentaje de diferencia para enviar alertas'),
      modo: yup.string().required('Se requiere el modo para monitoreo'),
      corte_x: yup.number(),
      corte_y: yup.number(),
      corte_ancho: yup.number(),
      corte_alto: yup.number(),
      preacciones: yup.object(),
      texto_analisis: yup.string(),
      texto_clave: yup.string(),
    });

    await schema.validate(req.body, { abortEarly: true });
    // Validamos que ya se ha creado la captura
    if(!fs.existsSync(path.join(SCREENSHOTS_DIR, `${req.session.browserId}-screenshot.png`))){
      throw (new BadRequestError('No se ha creado la captura de pantalla'));
    }
    // Sumar segundos a la fecha
    const currentDate = new Date();
    // Mover imagen de screenshots a la carpeta de imagenes base
    const newFileLocation = path.join(BASEIMAGE_DIR, `${req.session.browserId}-base.png`);
    fs.renameSync(path.join(SCREENSHOTS_DIR, `${req.session.browserId}-screenshot.png`), newFileLocation);
    // Guardar la ubicacion de la imagen
    req.body.imageBasePath = newFileLocation;
    req.body.userId = 1;
    logger.info(`Session: ${req.session}`);
    logger.info(req.session);
    // Validar la peticion
    const payload:CreatePagesToTrackDTO = req.body;
    const result = await PagesToTrackService.create(payload as CreationAttributes<PagesToTrack>);
    
    if(!result) {
      throw (new BadRequestError('Error al crear trabajo'));
    } else {
      // Crear resultados
      const jobs : CreationAttributes<ScheduledTrackingResults>[] = [];
      for(let i = 0; i < 12; i++){
        logger.info((parseInt(result.frecuencia) * (i + 1)));
        const nuevaFecha = new Date(currentDate);
        nuevaFecha.setSeconds(currentDate.getSeconds() + (parseInt(req.body.frecuencia) * (i + 1)));
        jobs.push({
          tiempoChequeo: nuevaFecha,
          userId: 1,
          pagesToTrackId: result.id
        });
      }
      ScheduledTrackingResults.bulkCreate(jobs);
      res.status(201).send(result);
    }
  } catch(error){
    next(error);
  }
  
};

export const getPagesToTrack = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
    const result = await PagesToTrack.findAll({ where: {
      userId: req.session.user?.id
    } });
    if(!result) {
      throw (new BadRequestError('Error al obtener trabajos'));
    } else {
      res.status(200).send({ success: true, statusCode: 200, data: result });
    }
  } catch(error){
    next(error);
  }
  
};

export const getSinglePage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
    const schema = yup.object().shape({
      pageId: yup.number().required('pageId requerido')
    });

    await schema.validate(req.params, { abortEarly: true });
    const params = req.params;
  
    const result = await PagesToTrackService.getById(parseInt(params.pageId))
    if(!result) {
      throw (new BadRequestError('Error al obtener página'));
    } else {
      res.status(200).send({ success: true, statusCode: 200, data: result });
    }
  } catch(error){
    next(error);
  }
  
};

export const pausePage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
    const params = req.params;
    const result = await PagesToTrack.findOne({ where: {
      userId: req.session.user?.id,
      uuid: params.pageId
    } });
    if(!result) {
      throw (new BadRequestError('Error al obtener páginas'));
    } else {
      result.activo = false;
      await result.save();
      res.status(200).send({ success: true, statusCode: 200, data: result });
    }
  } catch(error){
    next(error);
  }
  
};

export const deletePage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
    const params = req.params;
    const result = await PagesToTrack.findOne({ where: {
      userId: req.session.user?.id,
      uuid: params.pageId
    } });
    if(!result) {
      throw (new BadRequestError('Error al obtener páginas'));
    } else {
      await result.destroy();
      res.status(200).send({ success: true, statusCode: 200, data: result });
    }
  } catch(error){
    next(error);
  }
  
};

export const getPageBaseImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
    const schema = yup.object().shape({
      pageId: yup.number().required('pageId requerido')
    });
    await schema.validate(req.params, { abortEarly: true });
    const params = req.params;

    const result = await PagesToTrackService.getById(parseInt(params.pageId))
    if(!result) {
      throw (new BadRequestError('Error al obtener la página'));
    } else {
      const img = fs.readFileSync(result.imageBasePath);
      res.writeHead(200, {
        'x-escomonitor-image-path': result.imageBasePath,
        'Content-Type': 'image/png',
        'Content-Length': img.length
      });
      res.end(img);
    }
  } catch(error){
    next(error);
  }
  
};
