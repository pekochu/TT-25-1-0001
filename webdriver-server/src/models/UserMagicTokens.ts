import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute } from 'sequelize';
import { UserData } from '@project/server/app/models';
import sequelizeConnection from '@project/server/app/database/config';

class UserMagicTokens extends Model<InferAttributes<UserMagicTokens>, InferCreationAttributes<UserMagicTokens>> {
    declare id: CreationOptional<number>;
    declare token: string;
    declare expirado: boolean;
    declare tipo: string;
    declare userId: ForeignKey<UserData['id']>;
    declare user?: NonAttribute<UserData>;
    
    // marcas de tiempo
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date>;
}

UserMagicTokens.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false
  },
  expirado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'login'
  },
  userId: {
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

export default UserMagicTokens;