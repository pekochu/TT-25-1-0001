/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserData, PagesToTrack } from '@project/server/app/models';
import { Model } from 'sequelize';

const dbInit = (): Promise<[any, any]> => Promise.all([
  UserData.sync({ alter: true }),
  PagesToTrack.sync({ alter: true })
]);

export default dbInit; 