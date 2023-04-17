import express, { NextFunction } from 'express';
import compression from 'compression';  // compresses requests
import session from 'express-session';
import lusca from 'lusca';
import flash from 'express-flash';
import path from 'path';
import createWebDriverInstancePerSession from '@project/server/webdriver/webdriver-middleware';
import httpStatus from 'http-status';
import { SESSION_SECRET } from '@project/server/app/util/secrets';
// Controladores (manejo de rutas)
import * as apiController from '@project/server/app/controllers/api';

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
app.use(flash());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use(createWebDriverInstancePerSession);
app.use(
  express.static(path.join(__dirname, '../public'), { maxAge: 31557600000 })
);

// Deshabilitar header 'x-powered-by'
app.disable('x-powered-by');

app.get('/api/v1', apiController.getApi);
app.get('/api/v1/session', apiController.testSession);
app.get('/api/v1/goto', apiController.goToUrl);
app.get('/api/v1/screenshot', apiController.getScreenshot);
export default app;
