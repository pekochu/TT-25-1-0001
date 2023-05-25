import { Optional } from 'sequelize/types';

export type CreateUserMagicTokensDTO = {
    token: string;
    expirado?: string;
    userId: string;
}

export type UpdateUserMagicTokensDTO = Optional<CreateUserMagicTokensDTO, 'expirado'>

export type FilterUserMagicTokensDTO = {
    isDeleted?: boolean
    includeDeleted?: boolean
}