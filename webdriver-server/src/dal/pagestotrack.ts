import {Op} from 'sequelize';
import {isEmpty} from 'lodash';

import {PagesToTrack} from '@project/server/app/models';
import {GetAllPagesToTrackData} from '@project/server/app/dal/types';
import {PagesToTrackInput, PagesToTrackOutput} from '@project/server/app/models/PagesToTrack';

export const create = async (payload: PagesToTrackInput): Promise<PagesToTrackOutput> => {
  const pageToTrack = await PagesToTrack.create(payload);

  return pageToTrack;
};

export const update = async (id: number, payload: Partial<PagesToTrackInput>): Promise<PagesToTrackOutput> => {
  const pagesToTrack = await PagesToTrack.findByPk(id);

  if (!pagesToTrack) {
    // @todo Crear error personalizado
    throw new Error('not found');
  }

  const updatedPagesToTrack = await pagesToTrack.update(payload);
  return updatedPagesToTrack;
};

export const getById = async (id: number): Promise<PagesToTrackOutput> => {
  const pageToTrack = await PagesToTrack.findByPk(id);

  if (!pageToTrack) {
    // @todo throw custom error
    throw new Error('not found');
  }

  return pageToTrack;
};

export const getByComprobacion = async (): Promise<PagesToTrackOutput[]> => {
  const current = new Date();
  const pageToTrack = await PagesToTrack.findAll({
    where: {
      siguienteComprobacion: {
        [Op.eq]: current
      }
    }
  });

  if (!pageToTrack) {
    // @todo throw custom error
    throw new Error('not found');
  }

  return pageToTrack;
};

export const deleteById = async (id: number): Promise<boolean> => {
  const deletedPagesToTrackCount = await PagesToTrack.destroy({
    where: {id}
  });

  return !!deletedPagesToTrackCount;
};

export const getAll = async (filters?: GetAllPagesToTrackData): Promise<PagesToTrackOutput[]> => {
  return PagesToTrack.findAll({
    where: {
      ...(filters?.isDeleted && {deletedAt: {[Op.not]: undefined}})
    },
    ...((filters?.isDeleted || filters?.includeDeleted) && {paranoid: true})
  });
};