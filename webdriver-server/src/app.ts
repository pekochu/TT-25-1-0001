import express, { NextFunction } from 'express';
import compression from 'compression';  // compresses requests
import session from 'express-session';
import lusca from 'lusca';
import flash from 'express-flash';
import path from 'path';
import httpStatus from 'http-status';
import { SESSION_SECRET } from '@project/server/app/util/secrets';
// Controllers (route handlers)
import * as homeController from '@project/server/app/controllers/home';
import * as apiController from '@project/server/app/controllers/api';
import * as totalplayController from '@project/server/app/controllers/totalplay';
import * as contactController from '@project/server/app/controllers/contact';
import ApiError from '@project/server/app/util/apierror';

// Create Express server
const app = express();

// Express configuration
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

app.use(
    express.static(path.join(__dirname, '../public'), { maxAge: 31557600000 })
);

/**
 * API examples routes.
 */
app.get('/api/v1', apiController.getApi);
app.get('/api/v1/ip', apiController.getIp);
app.get('/api/v1/screenshot', apiController.getScreenshot);

export default app;
