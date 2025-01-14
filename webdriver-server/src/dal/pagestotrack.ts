import { CreationAttributes, Op } from 'sequelize';
import { isEmpty } from 'lodash';

import { PagesToTrack, ScheduledTrackingResults } from '@project/server/app/models';
import { GetAllPagesToTrackData } from '@project/server/app/dal/types';

export const create = async (payload: CreationAttributes<PagesToTrack>): Promise<PagesToTrack> => {
  const pageToTrack = await PagesToTrack.create(payload);

  return pageToTrack;
};

export const update = async (id: number, payload: Partial<CreationAttributes<PagesToTrack>>): Promise<PagesToTrack> => {
  const pagesToTrack = await PagesToTrack.findByPk(id);

  if (!pagesToTrack) {
    // @todo Crear error personalizado
    throw new Error('not found');
  }

  const updatedPagesToTrack = await pagesToTrack.update(payload);
  return updatedPagesToTrack;
};

export const getById = async (id: number): Promise<PagesToTrack> => {
  const pageToTrack = await PagesToTrack.findOne({
    where: {
      id,

    },
    include: [{
      model: ScheduledTrackingResults.scope('withoutPaths'),
      as: 'managedPagesResults'
    }],
    order: [
      // We start the order array with the model we want to sort
      [{ model: ScheduledTrackingResults, as: 'managedPagesResults' }, 'tiempoChequeo', 'ASC']
    ]
  });

  if (!pageToTrack) {
    // @todo throw custom error
    throw new Error('not found');
  }

  return pageToTrack;
};

export const getByIdWithResults = async (id: number): Promise<PagesToTrack> => {
  const pageToTrack = await PagesToTrack.findByPk(id, {
    include: [{
      model: ScheduledTrackingResults.scope('withoutPaths'),
      as: 'managedPagesResults',
      where: {
        diferencia: { [Op.gt]: -1 }
      }
    }],
    order: [
      // We start the order array with the model we want to sort
      [{ model: ScheduledTrackingResults, as: 'managedPagesResults' }, 'tiempoChequeo', 'ASC']
    ]
  });

  if (!pageToTrack) {
    // @todo throw custom error
    throw new Error('not found');
  }

  return pageToTrack;
};

export const deleteById = async (id: number): Promise<boolean> => {
  const deletedPagesToTrackCount = await PagesToTrack.destroy({
    where: { id }
  });

  return !!deletedPagesToTrackCount;
};

export const getAll = async (filters?: GetAllPagesToTrackData): Promise<PagesToTrack[]> => {
  return PagesToTrack.findAll({
    where: {
      ...(filters?.isDeleted && { deletedAt: { [Op.not]: undefined } })
    },
    ...((filters?.isDeleted || filters?.includeDeleted) && { paranoid: true }),
    include: [{
      model: ScheduledTrackingResults.scope('withoutPaths'),
      as: 'managedPagesResults'
    }],
    order: [
      // We start the order array with the model we want to sort
      [{ model: ScheduledTrackingResults, as: 'managedPagesResults' }, 'tiempoChequeo', 'ASC']
    ]
  });
};