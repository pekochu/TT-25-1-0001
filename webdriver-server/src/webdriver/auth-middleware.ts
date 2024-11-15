/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Express, Request, Response, NextFunction, response } from 'express';
import { remote } from 'webdriverio';
import browserConfig from '@project/server/webdriver/browser';
import logger from '@project/server/app/util/logger';
import WebdriverInstances, { WebDriverObject } from '@project/server/webdriver/instances-webdriver';
import { ForbiddenError } from '@project/server/app/util/apierror';
import { verifyToken } from '@project/server/app/lib/jwt';
import { UserData } from '@project/server/app/models';


// Your custom "middleware" function:
export default async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if(!req.headers.authorization){
      throw (new ForbiddenError('No tienes permisos para acceder a estos recursos'));
    }else{
      const token = req.headers.authorization.replace('Bearer ', '');
      const decoded = await verifyToken(
        token,
        process.env.JWT_ACCESS_TOKEN_SECRET as string
      );
  
      if(!decoded){
        throw (new ForbiddenError('Token no válido'));
      }
      // Obtener datos del usuario
      const result = await UserData.findOne({ where: { id: decoded.id } });
      if(!result){
        throw (new ForbiddenError('Usuario no encontrado'));
      }else{
        req.session.user = result as UserData;
      }
      
    }
    
    next();
  } catch (error) {
    next(error);
  }
  
}