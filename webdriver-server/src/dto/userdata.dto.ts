import { Optional } from 'sequelize/types';

export type CreateUserDataDTO = {
    nombre: string;
    email?: string;
    telefono?: string;
}

export type UpdateUserDataDTO = Optional<CreateUserDataDTO, 'email'>

export type FilterUserDatasDTO = {
    isDeleted?: boolean
    includeDeleted?: boolean
}