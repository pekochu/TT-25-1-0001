import { DataTypes, Model, ModelStatic, Optional } from 'sequelize';
import sequelizeConnection from '@project/server/app/database/config';

export interface PagesToTrackAttributes {
    id: number;
    uuid: string;
    url: string;
    descripcion?: string;
    frecuencia: string;
    diferenciaAlerta: number
    imageBasePath: string;
    siguienteComprobacion: Date;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export type PagesToTrackInput = Optional<PagesToTrackAttributes, 'id' | 'uuid'>

export type PagesToTrackOutput = Required<PagesToTrackAttributes>

class PagesToTrack extends Model<PagesToTrackAttributes, PagesToTrackInput> implements PagesToTrackAttributes {
    public id!: number
    public uuid!: string
    public url!: string
    public descripcion!: string
    public frecuencia!: string
    public diferenciaAlerta!: number
    public imageBasePath!: string
    public siguienteComprobacion!: Date
    // marcas de tiempo
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;
}

PagesToTrack.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  uuid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING
  },
  frecuencia: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  diferenciaAlerta: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  siguienteComprobacion: {
    type: DataTypes.DATE,
    allowNull: false
  },
  imageBasePath: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  sequelize: sequelizeConnection,
  paranoid: true
});

export default PagesToTrack;