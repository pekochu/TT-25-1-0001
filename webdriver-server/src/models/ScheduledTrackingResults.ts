import { DataTypes, ForeignKey, Model, CreationOptional, NonAttribute, InferAttributes, InferCreationAttributes } from 'sequelize';
import { PagesToTrack, UserData } from '@project/server/app/models';
import sequelizeConnection from '@project/server/app/database/config';

class ScheduledTrackingResults extends Model<InferAttributes<ScheduledTrackingResults>, InferCreationAttributes<ScheduledTrackingResults>> {
    declare id: CreationOptional<number>
    declare uuid: CreationOptional<string>
    declare descripcion: CreationOptional<string>
    declare diferencia: CreationOptional<number>
    declare imageChequeoPath: CreationOptional<string>
    declare imageDiferenciaPath: CreationOptional<string>
    declare tiempoChequeo: Date
    declare userId: ForeignKey<UserData['id']>;
    declare userData?: NonAttribute<UserData>;
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
    allowNull: true,
  },
  diferencia: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  imageChequeoPath: {
    type: DataTypes.STRING,
    allowNull: true
  },
  imageDiferenciaPath: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tiempoChequeo: {
    type: DataTypes.DATE,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true
  },
  pagesToTrackId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
  deletedAt: DataTypes.DATE,
}, {
  sequelize: sequelizeConnection,
  paranoid: true
});

export default ScheduledTrackingResults;