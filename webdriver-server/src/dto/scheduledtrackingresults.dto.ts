import { Optional } from 'sequelize/types';

export type CreateScheduledPagesToTrackDTO = {
    descripcion?: string;
    diferencia: number;
    frecuencia: string;
    imageChequeoPath: string;
    imageDiferenciaPath: string;
    tiempoChequeo: Date;
    userId: number;
    pagesToTrackId: number;
}

export type UpdateScheduledPagesToTrackDTO = Optional<CreateScheduledPagesToTrackDTO, 'descripcion'>

export type FilterScheduledPagesToTrackDTO = {
    isDeleted?: boolean
    includeDeleted?: boolean
}