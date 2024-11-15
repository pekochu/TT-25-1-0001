import * as pagestotrackDal from '@project/server/app/dal/pagestotrack';
import { GetAllPagesToTrackData } from '@project/server/app/dal/types';
import { PagesToTrack } from '@project/server/app/models';
import { CreationAttributes } from 'sequelize';

export const create = async (payload: CreationAttributes<PagesToTrack>): Promise<PagesToTrack | undefined> => {
  return pagestotrackDal.create(payload);
};

export const update = async (id: number, payload: Partial<CreationAttributes<PagesToTrack>>): Promise<PagesToTrack> => {
  return pagestotrackDal.update(id, payload);
};

export const getById = (id: number): Promise<PagesToTrack> => {
  return pagestotrackDal.getById(id);
};

export const getByIdWithResults = (id: number): Promise<PagesToTrack> => {
  return pagestotrackDal.getByIdWithResults(id);
};

export const deleteById = (id: number): Promise<boolean> => {
  return pagestotrackDal.deleteById(id);
};

export const getAll = (filters: GetAllPagesToTrackData): Promise<PagesToTrack[]> => {
  return pagestotrackDal.getAll(filters);
};