import express, { NextFunction } from 'express';
import compression from 'compression';  // compresses requests
import session from 'express-session';
import lusca from 'lusca';
import cors from 'cors';
import flash from 'express-flash';
import path from 'path';
import createWebDriverInstancePerSession from '@project/server/webdriver/webdriver-middleware';
import httpStatus from 'http-status';
import dbInit from '@project/server/app/database/init';
import { SESSION_SECRET } from '@project/server/app/util/secrets';
// Controladores (manejo de rutas)
import * as apiController from '@project/server/app/controllers/api';
import * as userdataController from '@project/server/app/controllers/userdata';
import * as pagestotrackController from '@project/server/app/controllers/pagestotrack';

// Conexion a base de datos
dbInit().finally();
// Crear servidor Express
const app = express();

// Configuracion de Express
app.set('port', process.env.SERVER_PORT || 3000);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: SESSION_SECRET || 'eaeaea!'
}));
app.use(cors({
  origin: ['localhost:3001', 'http://localhost:3001'], credentials: true
}));
app.use(flash());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use(
  express.static(path.join(__dirname, '../public'), { maxAge: 31557600000 })
);

// Deshabilitar header 'x-powered-by'
app.disable('x-powered-by');

app.get('/api/v1', apiController.getApi);
app.get('/api/v1/goto', createWebDriverInstancePerSession, apiController.goToUrl);
app.get('/api/v1/screenshot', createWebDriverInstancePerSession, apiController.getScreenshot);
app.post('/api/v1/element/screenshot', createWebDriverInstancePerSession, apiController.getElementScreenshot);
app.get('/api/v1/title', createWebDriverInstancePerSession, apiController.getTitlePage);
app.post('/api/v1/move', createWebDriverInstancePerSession, apiController.pointAtElement);
app.post('/api/v1/xpath', createWebDriverInstancePerSession, apiController.getElementsByNameOrXpath);
app.get('/api/v1/inputElements', createWebDriverInstancePerSession, apiController.getAllVisibleInputs);
// Crear usuario
app.post('/api/v1/user', userdataController.createUserData);
// Crear trabajo
app.post('/api/v1/test', pagestotrackController.createPagesToTrack);
export default app;
