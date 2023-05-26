import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import { UserData } from '@project/server/app/models';
import sequelizeConnection from '@project/server/app/database/config';

class PagesToTrack extends Model<InferAttributes<PagesToTrack>, InferCreationAttributes<PagesToTrack>> {
    declare id: CreationOptional<number>
    declare uuid: string
    declare url: string
    declare descripcion: CreationOptional<string>
    declare frecuencia: string
    declare diferenciaAlerta: number
    declare imageBasePath: string
    declare userId: ForeignKey<UserData['id']>;
    // marcas de tiempo
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date>;
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
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
  deletedAt: DataTypes.DATE,
}, {
  sequelize: sequelizeConnection,
  paranoid: true
});

export default PagesToTrack;