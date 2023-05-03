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
import { create } from '@project/server/app/database/services/PagesToTrackService';
import { PagesToTrackAttributes } from '@project/server/app/models/PagesToTrack';

export const createPagesToTrack = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
    const schema = yup.object().shape({
      url: yup.string().url().required('Por favor, introduce una URL'),
      email: yup.string().email().required('Por favor, introduce una cadena de texto con formato de correo electronico'),
      frecuencia: yup.number().required('Por favor, introduce la frecuencia'),
      descripcion: yup.string().required('Por favor, introduce una breve descripcion'),
      diferenciaAlerta: yup.number().required('Requerimos de un porcentaje de diferencia para enviar alertas'),
    });

    await schema.validate(req.body, {abortEarly: true});
    // Sumar segundos a la fecha
    const currentDate = new Date();
    currentDate.setSeconds(currentDate.getSeconds() + parseInt(req.body.frecuencia));
    req.body.siguienteComprobacion = currentDate;
    // Mover imagen de screenshots a la carpeta de imagenes base
    const newFileLocation = path.join(BASEIMAGE_DIR, `${req.session.browserId}-base.png`);
    fs.renameSync(path.join(SCREENSHOTS_DIR, `${req.session.browserId}-screenshot.png`), newFileLocation);
    // Guardar la ubicacion de la imagen
    req.body.imageBasePath = newFileLocation;
    // Validar la peticion
    const payload:CreatePagesToTrackDTO = req.body;
    const result = await create(payload as PagesToTrackAttributes);
    if(!result) {
      throw (new BadRequestError('Error al crear trabajo'));
    } else {
      res.status(201).send(result);
    }
  } catch(error){
    next(error);
  }
  
};
