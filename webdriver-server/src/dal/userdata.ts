import { Op } from 'sequelize';
import { isEmpty } from 'lodash';

import { UserData } from '@project/server/app/models';
import { GetAllUserData } from '@project/server/app/dal/types';
import { Attributes, CreationAttributes } from 'sequelize';

export const create = async (payload: CreationAttributes<UserData>): Promise<UserData> => {
  const userData = await UserData.create(payload);

  return userData;
};

export const findOrCreate = async (payload: CreationAttributes<UserData>): Promise<Attributes<UserData>> => {
  const [userData] = await UserData.findOrCreate({
    where: {
      email: payload.email
    },
    defaults: payload
  });

  return userData;
};

export const update = async (id: number, payload: Partial<CreationAttributes<UserData>>): Promise<Attributes<UserData>> => {
  const userData = await UserData.findByPk(id);

  if (!userData) {
    // @todo throw custom error
    throw new Error('not found');
  }

  const updatedUserData = await userData.update(payload);
  return updatedUserData;
};

export const getById = async (id: number): Promise<Attributes<UserData>> => {
  const ingredient = await UserData.findByPk(id);

  if (!ingredient) {
    // @todo throw custom error
    throw new Error('not found');
  }

  return ingredient;
};

export const deleteById = async (id: number): Promise<boolean> => {
  const deletedUserDataCount = await UserData.destroy({
    where: { id }
  });

  return !!deletedUserDataCount;
};

export const getAll = async (filters?: GetAllUserData): Promise<Attributes<UserData>[]> => {
  return UserData.findAll({
    where: {
      ...(filters?.isDeleted && { deletedAt: { [Op.not]: undefined } })
    },
    ...((filters?.isDeleted || filters?.includeDeleted) && { paranoid: true })
  });
};

export const checkEmailExists = async (email: string): Promise<boolean> => {
  const userWithEmail = await UserData.findOne({
    where: {
      email
    }
  });

  return !isEmpty(userWithEmail);
};