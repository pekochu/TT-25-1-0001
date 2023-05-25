import { DataTypes, ForeignKey, Model, ModelStatic, Optional } from 'sequelize';
import { UserData } from '@project/server/app/models';
import sequelizeConnection from '@project/server/app/database/config';

export interface PagesToTrackAttributes {
    id: number;
    uuid: string;
    url: string;
    descripcion?: string;
    frecuencia: string;
    diferenciaAlerta: number
    imageBasePath: string;
    userId: number;
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
    public userId!: ForeignKey<UserData['id']>;
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
  imageBasePath: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
}, {
  sequelize: sequelizeConnection,
  paranoid: true
});

export default PagesToTrack;