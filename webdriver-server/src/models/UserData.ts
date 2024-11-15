import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelizeConnection from '@project/server/app/database/config';

class UserData extends Model<InferAttributes<UserData>, InferCreationAttributes<UserData>> {
    declare id: CreationOptional<number>;
    declare nombre: string;
    declare email: string;
    declare telefono: CreationOptional<string>;
    declare activo: CreationOptional<boolean>;
    declare rol: number;
    declare refreshToken: CreationOptional<string>;
    declare twoFactorToken: CreationOptional<string | null>;
    
    // marcas de tiempo
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date>;
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
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  rol: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  refreshToken: {
    type: DataTypes.STRING,
  },
  twoFactorToken: {
    type: DataTypes.STRING,
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
  deletedAt: DataTypes.DATE,
}, {
  scopes: {
    withoutSensitiveData: {
      attributes: { exclude: ['refreshToken', 'twoFactorToken'] },
    }
  },
  sequelize: sequelizeConnection,
  paranoid: true
});

export default UserData;