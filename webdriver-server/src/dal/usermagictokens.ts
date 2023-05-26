import { CreationAttributes, Op } from 'sequelize';

import { UserMagicTokens, UserData } from '@project/server/app/models';
import { GetAllUserMagicTokensData } from '@project/server/app/dal/types';

export const create = async (payload: CreationAttributes<UserMagicTokens>): Promise<UserMagicTokens> => {
  const token = await UserMagicTokens.create(payload);

  return token;
};

export const update = async (id: number, payload: Partial<CreationAttributes<UserMagicTokens>>): Promise<UserMagicTokens> => {
  const token = await UserMagicTokens.findByPk(id);

  if (!token) {
    // @todo Crear error personalizado
    throw new Error('not found');
  }

  const updatedToken = await token.update(payload);
  return updatedToken;
};

export const getById = async (id: number): Promise<UserMagicTokens> => {
  const scheduled = await UserMagicTokens.findByPk(id, {
    include: [{
      model: UserData,
      required: false,
    }]
  });

  if (!scheduled) {
    // @todo throw custom error
    throw new Error('not found');
  }

  return scheduled;
};

export const deleteById = async (id: number): Promise<boolean> => {
  const deletedCount = await UserMagicTokens.destroy({
    where: { id }
  });

  return !!deletedCount;
};

export const getAll = async (filters?: GetAllUserMagicTokensData): Promise<UserMagicTokens[]> => {
  return UserMagicTokens.findAll({
    where: {
      ...(filters?.isDeleted && { deletedAt: { [Op.not]: undefined } })
    },
    ...((filters?.isDeleted || filters?.includeDeleted) && { paranoid: true }),
    include: [{
      model: UserData,
      required: false,
    }]
  });
};