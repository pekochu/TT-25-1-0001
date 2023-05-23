import errorHandler from 'errorhandler';
import app from './app';

import { closeExpiredBrowsers, ejecutarDiferenciaDeImagenes } from '@project/server/webdriver/webdriver-cron';



/**
 * Manejador de error
 */
if (process.env.NODE_ENV === 'development') {
  app.use(errorHandler());
}

/**
 * Cierra navegadores cuando expiran
 */
closeExpiredBrowsers();

/**
 * Realizar la diferencia y comprobacion
 */
// ejecutarDiferenciaDeImagenes();

/**
 * Inicia el servidor Express
 */
const server = app.listen(app.get('port'), () => {
  console.log(
    '  Corriendo en la URL http://localhost:%d en modo "%s"',
    app.get('port'),
    app.get('env')
  );
  console.log('Presiona Ctrl-C para detener\n');
});

export default server;
