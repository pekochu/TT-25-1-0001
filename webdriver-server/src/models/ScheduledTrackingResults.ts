import { DataTypes, ForeignKey, Model, CreationOptional, Optional, NonAttribute, InferAttributes, InferCreationAttributes } from 'sequelize';
import { PagesToTrack, UserData } from '@project/server/app/models';
import sequelizeConnection from '@project/server/app/database/config';

class ScheduledTrackingResults extends Model<InferAttributes<ScheduledTrackingResults>, InferCreationAttributes<ScheduledTrackingResults>> {
    declare id: CreationOptional<number>
    declare uuid: CreationOptional<string>
    declare descripcion: string
    declare diferencia: number
    declare imageChequeoPath: string
    declare imageDiferenciaPath: string
    declare tiempoChequeo: Date
    declare userId: ForeignKey<UserData['id']>;
    declare user?: NonAttribute<UserData>;
    declare pagesToTrackId: ForeignKey<PagesToTrack['id']>;
    declare pagesToTrack?: NonAttribute<PagesToTrack>;
    // marcas de tiempo
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date>;
}

ScheduledTrackingResults.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  uuid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  diferencia: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  imageChequeoPath: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imageDiferenciaPath: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tiempoChequeo: {
    type: DataTypes.DATE,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  pagesToTrackId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
  deletedAt: DataTypes.DATE,
}, {
  sequelize: sequelizeConnection,
  paranoid: true
});

export default ScheduledTrackingResults;