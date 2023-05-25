import { Optional } from 'sequelize/types';

export type CreatePagesToTrackDTO = {
    url: string;
    descripcion?: string;
    frecuencia: string;
    diferenciaAlerta: number;
    imageBasePath: string;
    userId: number;
}

export type UpdatePagesToTrackDTO = Optional<CreatePagesToTrackDTO, 'descripcion'>

export type FilterPagesToTrackDTO = {
    isDeleted?: boolean
    includeDeleted?: boolean
}