import * as userdataDal from '@project/server/app/dal/userdata';
import { GetAllUserData } from '@project/server/app/dal/types';
import { UserData } from '@project/server/app/models';
import { CreationAttributes } from 'sequelize';


export const create = async (payload: CreationAttributes<UserData>): Promise<UserData | undefined> => {
  const email = payload.email;
  const emailExists = await userdataDal.checkEmailExists(email);
  if(!emailExists){
    return userdataDal.create(payload);
  }
    
  return undefined;
};

export const update = async (id: number, payload: Partial<CreationAttributes<UserData>>): Promise<UserData> => {
  return userdataDal.update(id, payload);
};

export const getById = (id: number): Promise<UserData> => {
  return userdataDal.getById(id);
};

export const getByIdWithPages = (id: number): Promise<UserData> => {
  return userdataDal.getByIdWithPages(id);
};

export const deleteById = (id: number): Promise<boolean> => {
  return userdataDal.deleteById(id);
};

export const getAll = (filters: GetAllUserData): Promise<UserData[]> => {
  return userdataDal.getAll(filters);
};