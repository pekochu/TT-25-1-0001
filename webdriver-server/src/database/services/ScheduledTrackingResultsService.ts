import * as scheduledTrackingDal from '@project/server/app/dal/scheduledtrackingresults';
import { GetAllScheduledTrackingResultsData } from '@project/server/app/dal/types';
import { ScheduledTrackingResults } from '@project/server/app/models';
import { CreationAttributes } from 'sequelize';
 
export const create = async (payload: CreationAttributes<ScheduledTrackingResults>): Promise<ScheduledTrackingResults | undefined> => {
  return scheduledTrackingDal.create(payload);
};

export const update = async (id: number, payload: Partial<CreationAttributes<ScheduledTrackingResults>>): Promise<ScheduledTrackingResults> => {
  return scheduledTrackingDal.update(id, payload);
};

export const getById = (id: number): Promise<ScheduledTrackingResults> => {
  return scheduledTrackingDal.getById(id);
};

export const getScreenshotsById = (id: number): Promise<ScheduledTrackingResults> => {
  return scheduledTrackingDal.getScreenshotsById(id);
};

export const getByTiempoChequeo = (): Promise<ScheduledTrackingResults[]> => {
  return scheduledTrackingDal.getByTiempoChequeo();
};

export const deleteById = (id: number): Promise<boolean> => {
  return scheduledTrackingDal.deleteById(id);
};

export const getAll = (filters: GetAllScheduledTrackingResultsData): Promise<ScheduledTrackingResults[]> => {
  return scheduledTrackingDal.getAll(filters);
};