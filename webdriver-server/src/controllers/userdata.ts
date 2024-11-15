'use strict';

import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import * as yup from 'yup';
import logger from '@project/server/app/util/logger';
import { Response, Request, NextFunction } from 'express';
import { ValidationError, BadRequestError } from '@project/server/app/util/apierror';
import * as UserDataService from '@project/server/app/database/services/UserDataService';

import { UserData } from '@project/server/app/models';
import { CreationAttributes } from 'sequelize';

export const createUserData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
    const schema = yup.object().shape({
      nombre: yup.string().required('Por favor, introduce tu nombre'),
      email: yup.string().email().required('Por favor, introduce una cadena de texto con formato de correo electronico'),
      telefono: yup.string(),
    });

    const isValid = await schema.isValid(req.body);
    if (!(isValid)){
      throw new ValidationError();
    }

    const payload:CreationAttributes<UserData> = req.body;

    const result = await UserDataService.create(payload);
    if(!result) {
      throw (new BadRequestError('Este usuario ya existe'));
    } else {
      res.status(201).send(result);
    }
  } catch(error){
    next(error);
  }
  
};

export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
    const result = await UserDataService.getAll({includeDeleted: true});
    if(!result) {
      throw (new BadRequestError('Error al obtener usuarios'));
    } else {
      res.status(200).send({ success: true, statusCode: 200, data: result });
    }
  } catch(error){
    next(error);
  }
  
};

export const getPagesByUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try{
    const schema = yup.object().shape({
      userId: yup.number().required('userId requerido')
    });
    await schema.validate(req.params, { abortEarly: true });
    const params = req.params;

    const result = await UserDataService.getByIdWithPages(parseInt(params.userId));
    if(!result) {
      throw (new BadRequestError('Error al obtener usuarios'));
    } else {
      res.status(200).send({ success: true, statusCode: 200, data: result });
    }
  } catch(error){
    next(error);
  }
  
};
