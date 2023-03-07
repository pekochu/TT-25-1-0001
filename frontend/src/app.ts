import express, { NextFunction } from 'express';
import compression from 'compression';  // compresses requests
import session from 'express-session';
import lusca from 'lusca';
import flash from 'express-flash';
import path from 'path';
import httpStatus from 'http-status';
import { SESSION_SECRET } from '@project/app/util/secrets';
// Controllers (route handlers)
import * as homeController from '@project/app/controllers/home';
import * as contactController from '@project/app/controllers/contact';
import ApiError from '@project/app/util/apierror';

// Create Express server
const app = express();

// Express configuration
app.set('port', process.env.UI_PORT || 3001);
app.set('views', path.join(__dirname, '../../views'));
app.set('view engine', 'pug');
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
 * Primary app routes.
 */
app.get('/', homeController.index);
app.get('/contact', contactController.getContact);
app.post('/contact', contactController.postContact);

export default app;
