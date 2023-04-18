import { DataTypes, Model, ModelStatic, Optional } from 'sequelize';
import sequelizeConnection from '@project/server/app/database/config';

export interface UserDataAttributes {
    id: number;
    nombre: string;
    email: string;
    telefono?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export type UserDataInput = Optional<UserDataAttributes, 'id'>

export type UserDataOutput = Required<UserDataAttributes>

class UserData extends Model<UserDataAttributes, UserDataInput> implements UserDataAttributes {
    public id!: number
    public nombre!: string
    public email!: string
    public telefono!: string
    
    // marcas de tiempo
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;
}

UserData.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  telefono: {
    type: DataTypes.STRING
  },
}, {
  sequelize: sequelizeConnection,
  paranoid: true
});

export default UserData;