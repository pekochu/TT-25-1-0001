import * as userdataDal from '@project/server/app/dal/userdata';
import {GetAllUserData} from '@project/server/app/dal/types';
import {UserDataInput, UserDataOutput} from '@project/server/app/models/UserData';

export const create = async (payload: UserDataInput): Promise<UserDataOutput | undefined> => {
  const email = payload.email;
  const emailExists = await userdataDal.checkEmailExists(email);
  if(!emailExists){
    return userdataDal.create(payload);
  }
    
  return undefined;
};

export const update = async (id: number, payload: Partial<UserDataInput>): Promise<UserDataOutput> => {
  return userdataDal.update(id, payload);
};

export const getById = (id: number): Promise<UserDataOutput> => {
  return userdataDal.getById(id);
};

export const deleteById = (id: number): Promise<boolean> => {
  return userdataDal.deleteById(id);
};

export const getAll = (filters: GetAllUserData): Promise<UserDataOutput[]> => {
  return userdataDal.getAll(filters);
};