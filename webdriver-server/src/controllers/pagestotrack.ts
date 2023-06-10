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
import { create, getAll } from '@project/server/app/database/services/PagesToTrackService';
import { CreationAttributes } from 'sequelize';
import { PagesToTrack, ScheduledTrackingResults } from '@project/server/app/models';

export const createPagesToTrack = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
    const schema = yup.object().shape({
      url: yup.string().url().required('Por favor, introduce una URL'),
      email: yup.string().email().required('Por favor, introduce una cadena de texto con formato de correo electronico'),
      frecuencia: yup.number().required('Por favor, introduce la frecuencia'),
      descripcion: yup.string().required('Por favor, introduce una breve descripcion'),
      diferenciaAlerta: yup.number().required('Requerimos de un porcentaje de diferencia para enviar alertas'),
    });

    await schema.validate(req.body, { abortEarly: true });
    // Sumar segundos a la fecha
    const currentDate = new Date();
    req.body.siguienteComprobacion = currentDate;
    // Mover imagen de screenshots a la carpeta de imagenes base
    const newFileLocation = path.join(BASEIMAGE_DIR, `${req.session.browserId}-base.png`);
    fs.renameSync(path.join(SCREENSHOTS_DIR, `${req.session.browserId}-screenshot.png`), newFileLocation);
    // Guardar la ubicacion de la imagen
    req.body.imageBasePath = newFileLocation;
    req.body.userId = 1;
    // Validar la peticion
    const payload:CreatePagesToTrackDTO = req.body;
    const result = await create(payload as CreationAttributes<PagesToTrack>);
    

    if(!result) {
      throw (new BadRequestError('Error al crear trabajo'));
    } else {
      // Crear resultados
      const jobs : CreationAttributes<ScheduledTrackingResults>[] = [];
      for(let i = 0; i < 12; i++){
        currentDate.setSeconds(currentDate.getSeconds() + (parseInt(req.body.frecuencia) * (i + 1)));
        jobs.push({
          tiempoChequeo: currentDate,
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
    const result = await getAll({});
    if(!result) {
      throw (new BadRequestError('Error al obtener trabajos'));
    } else {
      res.status(200).send({ data: [
        { descripcion: 'Aqui mama el Peko', id: 1, url: 'google.com' }, { descripcion: 'Aqui mama el German', id: 2, url: 'youtube.com' }, { descripcion: 'Aqui mama el Ivan', id: 1, url: 'porn.com' }
      ] });
    }
  } catch(error){
    next(error);
  }
  
};
