'use strict';

import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import * as yup from 'yup';
import * as auth from '@project/server/app/lib/auth';
import { Response, Request, NextFunction } from 'express';
import logger from '@project/server/app/util/logger';
import { InternalServerError, NotFoundError, UnauthorizedError } from '@project/server/app/util/apierror';
import { UserData } from '@project/server/app/models';
import { generateConfirmLoginBodyHTML, generateConfirmLoginBodyPlain, generateSomeoneLoggedInBodyHTML, generateSomeoneLoggedInBodyPlain, sendEmail } from '@project/server/app/lib/mail';
import { verifyToken } from '@project/server/app/lib/jwt';

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

    let msg = `Mandamos un link a su correo electrónico (${result.email}) para que pueda iniciar sesión en el sistema`;
    if(!result.activo) {
      msg = `Es necesario activar su cuenta. Revise su bandeja de entrada (${result.email}) para que pueda iniciar sesión en el sistema y activaremos su cuenta en el proceso.`;
    }

    // Crear sesión
    const session = {
      id: result.id,
      email: result.email,
      nombre: result.nombre,
      rol: result.rol
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
        text: generateConfirmLoginBodyPlain(),
        html: generateConfirmLoginBodyHTML({ url: `${process.env.APP_FRONT_URL}/auth?token=${twoFactorToken}`, theme: {} }),
      });
    }catch(error){
      // throw (new InternalServerError('No se pudo enviar el correo:\n' + error));
    }
    // Actualizar la tabla de usuarios con el token de refresco    
    result.refreshToken = refreshToken;
    result.twoFactorToken = twoFactorToken;
    result.save();
    // Enviar datos
    res.status(200).send({ success: true, data: { msg, session, token, refreshToken } });
  } catch(error){
    next(error);
  }
    
};

export const authToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
    const schema = yup.object().shape({
      token: yup.string().required('El twoFactorToken es necesario')
    });
    // Validar datos del formulario
    await schema.validate(req.body, { abortEarly: true });
    // Obtener y guardar el token
    const twoFactorToken = req.body.token as string;
    const decoded = await verifyToken(
      twoFactorToken,
      process.env.JWT_TWO_FACTOR_TOKEN_SECRET as string
    );

    if(!decoded){
      throw (new UnauthorizedError('Token no válido'));
    }
    // Obtener datos del usuario
    const result = await UserData.findOne({ where: { id: decoded.id } });
  
    if(!result) {
      throw (new NotFoundError('Usuario no encontrado'));
    }

    if (result.twoFactorToken != twoFactorToken) {
      throw (new UnauthorizedError('El token no coincide'));
    }

    // Enviar correo
    try{
      await sendEmail({
        to: result.email,
        subject: 'Se ha registrado un acceso a tu cuenta',
        text: generateSomeoneLoggedInBodyPlain(),
        html: generateSomeoneLoggedInBodyHTML({ url: '', theme: {} }),
      });
    }catch(error){
      logger.error('No se pudo enviar el correo');
    }
    // Crear resultados
    const session = {
      id: result.id,
      email: result.email,
      nombre: result.nombre,
      rol: result.rol
    };
    console.log(`${result.email} ha iniciado sesión`);
    // Actualizar la tabla de usuarios con el token de refresco    
    result.twoFactorToken = null;
    result.save();
    // Enviar datos
    res.status(200).send({ success: true, statusCode: 200, data: { session } });
  } catch(error){
    next(error);
  }
    
};

export const refreshAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
    const schema = yup.object().shape({
      token: yup.string().required('El refreshToken es requerido')
    });
    // Validar datos del formulario
    await schema.validate(req.body, { abortEarly: true });
    // Obtener y guardar el token
    const refreshToken = req.body.token as string;
    const decoded = await verifyToken(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET as string
    );

    if(!decoded){
      throw (new UnauthorizedError('Token no válido'));
    }
    // Obtener datos del usuario
    const result = await UserData.findOne({ where: { id: decoded.id } });
  
    if(!result) {
      throw (new NotFoundError('Usuario no encontrado'));
    }

    if(result.refreshToken != refreshToken) {
      throw (new NotFoundError('El token no coincide'));
    }

    // Crear resultados
    const session = {
      id: result.id,
      email: result.email,
      nombre: result.nombre,
      rol: result.rol
    };

    // generate access
    const accessToken = auth.generateAccessToken(session);

    // Enviar datos
    res.status(200).send({ success: true, data: { session, accessToken } });
  } catch(error){
    next(new UnauthorizedError('Error al procesar datos'));
  }
    
};
  
export const currentUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
    const schema = yup.object().shape({
      token: yup.string().required('El accessToken es requerido')
    });
    logger.info(req.body);
    // Validar datos del formulario
    await schema.validate(req.body, { abortEarly: true });
    // Obtener y guardar el token
    const accessToken = req.body.token as string;
    const decoded = await verifyToken(
      accessToken,
      process.env.JWT_ACCESS_TOKEN_SECRET as string
    );

    if(!decoded){
      throw (new UnauthorizedError('Token no válido'));
    }
    // Obtener datos del usuario
    const result = await UserData.findOne({ where: { id: decoded.id } });
  
    if(!result) {
      throw (new NotFoundError('Usuario no encontrado'));
    }
    // Enviar datos
    res.status(200).send({ success: true, data: { user: result } });
  } catch(error){
    next(error);
  }
    
};
