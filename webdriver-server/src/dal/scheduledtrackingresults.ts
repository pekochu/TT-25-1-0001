import { CreationAttributes, Op } from 'sequelize';
import { PagesToTrack, ScheduledTrackingResults, UserData } from '@project/server/app/models';
import { GetAllScheduledTrackingResultsData } from '@project/server/app/dal/types';

export const create = async (payload: CreationAttributes<ScheduledTrackingResults>): Promise<ScheduledTrackingResults> => {
  const scheduled = await ScheduledTrackingResults.create(payload);

  return scheduled;
};

export const bulkCreate = async (payload: CreationAttributes<ScheduledTrackingResults>[]): Promise<ScheduledTrackingResults[]> => {
  const scheduled = await ScheduledTrackingResults.bulkCreate(payload);

  return scheduled;
};


export const update = async (id: number, payload: Partial<CreationAttributes<ScheduledTrackingResults>>): Promise<ScheduledTrackingResults> => {
  const scheduled = await ScheduledTrackingResults.findByPk(id);

  if (!scheduled) {
    // @todo Crear error personalizado
    throw new Error('not found');
  }

  const updatedScheduledTrackingResults = await scheduled.update(payload);
  return updatedScheduledTrackingResults;
};

export const getById = async (id: number): Promise<ScheduledTrackingResults> => {
  const scheduled = await ScheduledTrackingResults.findByPk(id, {
    include: [{
      model: PagesToTrack,
    }, {
      model: UserData,
    }]
  });

  if (!scheduled) {
    // @todo throw custom error
    throw new Error('not found');
  }

  return scheduled;
};

export const getByTiempoChequeo = async (): Promise<ScheduledTrackingResults[]> => {
  const current = new Date();
  const scheduled = await ScheduledTrackingResults.findAll({
    where: {
      tiempoChequeo: {
        [Op.eq]: current
      }
    },
    include: [{
      model: PagesToTrack,
      as: 'pagesToTrack'
    }, {
      model: UserData,
      as: 'userData'
    }]
  });

  if (!scheduled) {
    // @todo throw custom error
    throw new Error('not found');
  }

  return scheduled;
};

export const deleteById = async (id: number): Promise<boolean> => {
  const deletedCount = await ScheduledTrackingResults.destroy({
    where: { id }
  });

  return !!deletedCount;
};

export const getAll = async (filters?: GetAllScheduledTrackingResultsData): Promise<ScheduledTrackingResults[]> => {
  return ScheduledTrackingResults.findAll({
    where: {
      ...(filters?.isDeleted && { deletedAt: { [Op.not]: undefined } })
    },
    ...((filters?.isDeleted || filters?.includeDeleted) && { paranoid: true }),
    include: [{
      model: PagesToTrack,
    }, {
      model: UserData,
    }]
  });
};