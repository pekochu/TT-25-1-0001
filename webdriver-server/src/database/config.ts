import { Dialect, Sequelize } from 'sequelize';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const dbDriver = 'mysql';
const dbName = process.env.DB_NAME as string;
const dbUser = process.env.DB_USER as string;
const dbHost = process.env.DB_HOST;
const dbPassword = process.env.DB_PASS;

const sequelizeConnection = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: dbDriver
});

export default sequelizeConnection;