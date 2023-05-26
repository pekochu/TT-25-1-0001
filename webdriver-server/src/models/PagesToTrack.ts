import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import { UserData } from '@project/server/app/models';
import sequelizeConnection from '@project/server/app/database/config';

class PagesToTrack extends Model<InferAttributes<PagesToTrack>, InferCreationAttributes<PagesToTrack>> {
    declare id: CreationOptional<number>;
    declare uuid: string;
    declare url: string;
    declare descripcion: CreationOptional<string>;
    declare frecuencia: string;
    declare diferenciaAlerta: number;
    declare imageBasePath: string;
    declare modo: string;
    declare corte_ancho: CreationOptional<number>;
    declare corte_alto: CreationOptional<number>;
    declare corte_x: CreationOptional<number>;
    declare corte_y: CreationOptional<number>;
    declare preacciones: CreationOptional<JSON>;
    declare texto_analisis: CreationOptional<string>;
    declare texto_clave: CreationOptional<string>;
    declare userId: ForeignKey<UserData['id']>;
    declare activo: CreationOptional<boolean>;
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
  modo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  corte_ancho: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  corte_alto: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  corte_x: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  corte_y: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  preacciones: {
    type: DataTypes.JSON,
    allowNull: true
  },
  texto_analisis: {
    type: DataTypes.STRING,
    allowNull: true
  },
  texto_clave: {
    type: DataTypes.STRING,
    allowNull: true
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
  deletedAt: DataTypes.DATE,
}, {
  sequelize: sequelizeConnection,
  paranoid: true
});

export default PagesToTrack;