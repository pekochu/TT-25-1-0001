'use strict';

import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import * as yup from 'yup';
import * as auth from '@project/server/app/lib/auth';
import { Response, Request, NextFunction } from 'express';
import WebdriverInstances from '@project/server/webdriver/instances-webdriver';
import CaptureSnapshot from '@project/server/webdriver/CaptureSnapshot';
import { validationResult, check } from 'express-validator';
import logger from '@project/server/app/util/logger';
import { InternalServerError, NotFoundError, BadRequestError } from '@project/server/app/util/apierror';
import { CreationAttributes } from 'sequelize';
import { UserData, UserMagicTokens } from '@project/server/app/models';
import { sendEmail } from '@project/server/app/lib/mail';

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
    const schema = yup.object().shape({
      email: yup.string().email().required('Por favor, introduce una cadena de texto con formato de correo electronico')
    });
      // Validar datos del formulario
    await schema.validate(req.body, { abortEarly: true });
      
    // Obtener datos del usuario
    const result = await UserData.findOne({ where: { email: req.body.email } });
  
    if(!result) {
      throw (new NotFoundError('Usuario no encontrado'));
    }

    if(!result.activo) {
      throw (new BadRequestError('Usuario no ha activado su cuenta'));
    }

    // Crear resultados
    const session = {
      id: result.id,
      email: result.email,
      nombre: result.nombre
    };

    // generate access + refresh token + email token for 2 factor authentication
    const token = auth.generateAccessToken(session);
    const refreshToken = auth.generateRefreshToken(session);
    const twoFactorToken = auth.generateTwoFactorToken(session);

    // Enviar correo
    try{
      await sendEmail({
        to: result.email,
        subject: 'ESCOMONITOR - Iniciar sesión',
        text: `Clic aquí para iniciar sesión...`,
        html: `<a href="http://${process.env.APP_FRONT_URL}/auth?token=${twoFactorToken}">Clic para iniciar sesión</a>`,
      });
    }catch(error){
      throw (new InternalServerError('No se pudo enviar el correo'));
    }
    // Actualizar la tabla de usuarios con el token de refresco    
    result.refreshToken = refreshToken;
    result.save();
    // Agregar el magic link de inicio de sesión 
    UserMagicTokens.create({ token: twoFactorToken, userId: result.id, tipo: 'login', expirado: false });
    // Enviar datos
    res.status(200).send({ success: true, data: { session, token, refreshToken } });
  } catch(error){
    next(error);
  }
    
};
  


