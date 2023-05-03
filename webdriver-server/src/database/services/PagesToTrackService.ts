import * as pagestotrackDal from '@project/server/app/dal/pagestotrack';
import {GetAllPagesToTrackData} from '@project/server/app/dal/types';
import {PagesToTrackInput, PagesToTrackOutput} from '@project/server/app/models/PagesToTrack';

export const create = async (payload: PagesToTrackInput): Promise<PagesToTrackOutput | undefined> => {
  return pagestotrackDal.create(payload);
};

export const update = async (id: number, payload: Partial<PagesToTrackInput>): Promise<PagesToTrackOutput> => {
  return pagestotrackDal.update(id, payload);
};

export const getById = (id: number): Promise<PagesToTrackOutput> => {
  return pagestotrackDal.getById(id);
};

export const getByComprobacion = (): Promise<PagesToTrackOutput[]> => {
  return pagestotrackDal.getByComprobacion();
};

export const deleteById = (id: number): Promise<boolean> => {
  return pagestotrackDal.deleteById(id);
};

export const getAll = (filters: GetAllPagesToTrackData): Promise<PagesToTrackOutput[]> => {
  return pagestotrackDal.getAll(filters);
};