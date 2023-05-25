import * as userdataDal from '@project/server/app/dal/userdata';
import { GetAllUserData } from '@project/server/app/dal/types';
import { UserData } from '@project/server/app/models';
import { Attributes, CreationAttributes } from 'sequelize';


export const create = async (payload: CreationAttributes<UserData>): Promise<UserData | undefined> => {
  const email = payload.email;
  const emailExists = await userdataDal.checkEmailExists(email);
  if(!emailExists){
    return userdataDal.create(payload);
  }
    
  return undefined;
};

export const update = async (id: number, payload: Partial<CreationAttributes<UserData>>): Promise<Attributes<UserData>> => {
  return userdataDal.update(id, payload);
};

export const getById = (id: number): Promise<Attributes<UserData>> => {
  return userdataDal.getById(id);
};

export const deleteById = (id: number): Promise<boolean> => {
  return userdataDal.deleteById(id);
};

export const getAll = (filters: GetAllUserData): Promise<Attributes<UserData>[]> => {
  return userdataDal.getAll(filters);
};