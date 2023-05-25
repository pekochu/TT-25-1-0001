import { DataTypes, ForeignKey, Model, ModelStatic, Optional } from 'sequelize';
import { UserData } from '@project/server/app/models';
import sequelizeConnection from '@project/server/app/database/config';

export interface UserMagicTokensAttributes {
    id: number;
    token: string;
    expirado: boolean;
    userId: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export type UserMagicTokensInput = Optional<UserMagicTokensAttributes, 'id'>

export type UserMagicTokensOutput = Required<UserMagicTokensAttributes>

class UserMagicTokens extends Model<UserMagicTokensAttributes, UserMagicTokensInput> implements UserMagicTokensAttributes {
    public id!: number
    public token!: string
    public expirado!: boolean
    public userId!: ForeignKey<UserData['id']>
    
    // marcas de tiempo
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;
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
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
}, {
  sequelize: sequelizeConnection,
  paranoid: true
});

export default UserMagicTokens;