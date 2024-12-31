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
import { CreationAttributes } from 'sequelize';
import { PagesToTrack, ScheduledTrackingResults, UserData } from '@project/server/app/models';
import WebdriverInstances from '@project/server/webdriver/instances-webdriver';

export const createNewUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
    const schema = yup.object().shape({
      url: yup.string().required('Por favor, introduce una URL'),
      nombre: yup.string().required('Por favor, introduce un nombre'),
      descripcion: yup.string().required('Por favor, introduce una descripición para la página'),
      email: yup.string().email().required('Por favor, introduce una cadena de texto con formato de correo electronico'),
      telefono: yup.string().min(10).max(10).required('Por favor, introduce una número de teléfono en el area de la Republica Mexicana'),
      frecuencia: yup.number().required('Por favor, introduce la frecuencia'),
      diferenciaAlerta: yup.number().required('Requerimos de un porcentaje de diferencia para enviar alertas'),
      modo: yup.string().required('Se requiere el modo para monitoreo'),
      tiempoEspera: yup.number(),
      corte_x: yup.number(),
      corte_y: yup.number(),
      corte_ancho: yup.number(),
      corte_alto: yup.number(),
      preacciones: yup.array()
    });

    await schema.validate(req.body, { abortEarly: true });
    // Validamos que ya hay navegador
    if(!req.session.browserId){
      throw (new BadRequestError('No hay navegador asignado al usuario'));
    }
    // Validamos que ya se ha creado la captura
    if(!fs.existsSync(path.join(SCREENSHOTS_DIR, `${req.session.browserId}-screenshot.png`))){
      throw (new BadRequestError('No se ha creado la captura de pantalla'));
    }
    // Creamos el usuario
    const userPayload: CreationAttributes<UserData> = req.body;
    const emailExists = await UserData.findOne({ where: {
      email: userPayload.email
    } });
    if(emailExists){
      throw (new BadRequestError('El email ya existe en los registros'));
    }
    const userResult = await UserData.create(userPayload);
    // Crear pagina a monitorear
    const pagesPayload: CreationAttributes<PagesToTrack> = req.body;
    pagesPayload.userId = userResult.id;
    pagesPayload.url = (pagesPayload.url.indexOf('://') === -1) ? 'https://' + pagesPayload.url : pagesPayload.url;
    if(req.body.modo.toLowerCase() === 'texto'){
      const webDriverInstance = WebdriverInstances.get(req.session.id);
      const browser = webDriverInstance?.browser as WebdriverIO.Browser;
      const bodyText = await (await browser.$('//body')).getText();
      pagesPayload.texto_analisis = bodyText;
    }
    
    // Sumar segundos a la fecha
    const currentDate = new Date();
    req.body.siguienteComprobacion = currentDate;
    // Mover imagen de screenshots a la carpeta de imagenes base
    const newFileLocation = path.join(BASEIMAGE_DIR, `${req.session.browserId}-${Date.now()}-base.png`);
    fs.renameSync(path.join(SCREENSHOTS_DIR, `${req.session.browserId}-screenshot.png`), newFileLocation);
    // Guardar la ubicacion de la imagen
    req.body.imageBasePath = newFileLocation;
    // Validar la peticion
    const result = await PagesToTrack.create(pagesPayload);
  
    if(!result) {
      throw (new BadRequestError('Error al crear trabajo'));
    } else {
      // Crear resultados
      const jobs : CreationAttributes<ScheduledTrackingResults>[] = [];
      for(let i = 0; i < 12; i++){
        const nuevaFecha = new Date(currentDate);
        nuevaFecha.setSeconds(currentDate.getSeconds() + (parseInt(req.body.frecuencia) * (i + 1)));
        jobs.push({
          tiempoChequeo: nuevaFecha,
          userId: userResult.id,
          pagesToTrackId: result.id
        });
      }
      const sesiones = await ScheduledTrackingResults.bulkCreate(jobs);
      res.status(201).send({ success: true, statusCode: 201, data: { usuario: userResult, paginas: result, sesiones: sesiones } });
    }
  } catch(error){
    next(error);
  }
  
};