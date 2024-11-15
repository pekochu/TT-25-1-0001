/* eslint-disable @typescript-eslint/ban-ts-comment */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { PNG } from 'pngjs';
import logger from '@project/server/app/util/logger';
import { remote } from 'webdriverio';
import browserConfig from '@project/server/webdriver/browser';
import CaptureSnapshot from '@project/server/webdriver/CaptureSnapshot';
import WebdriverInstances, { WebDriverObject } from '@project/server/webdriver/instances-webdriver';
import { CronJob } from 'cron';
import { getByTiempoChequeo, update } from '@project/server/app/database/services/ScheduledTrackingResultsService';
import { v4 as uuidv4 } from 'uuid';
import { generateDifferenceDetectedBodyText, generateDifferenceDetectedBodyHTML, sendEmailWithAttachments } from '@project/server/app/lib/mail';
import { SCREENSHOTS_DIR, CHECKIMAGE_DIR, DIFFIMAGE_DIR } from '@project/server/app/util/constants';
import pixelmatch from 'pixelmatch';
import { InferCreationAttributes } from 'sequelize';
import { ScheduledTrackingResults } from '../models';
import RealizarDiferenciaImagen from './RealizarDiferenciaImagen';

// Funcion para cerrar los navegadores
// que ya no fueron usados despues de 
// 10 minutos de inactividad
export async function closeExpiredBrowsers(): Promise<void> {
  try {
    new CronJob('0,10,20,30,40,50 * * * * *',
      async function() {
        WebdriverInstances.forEach(async (browserObject, index) => {
          const now = Date.now();
          const differenceTime = (now - browserObject.expires) / 1000;
          if(differenceTime > 600) {
            logger.info(`Cerrando navegador ${browserObject.browserId} porque ya supero los 600 segundos ${differenceTime}`);
            await browserObject.browser.deleteSession();
            WebdriverInstances.delete(index);
          }
        });
      },
      null,
      true,
      'America/Los_Angeles'
    );
  } catch (error) {
    logger.error(error);
  }
  
}

// Funcion para cerrar los navegadores
// que ya no fueron usados despues de 
// 10 minutos de inactividad
export async function ejecutarDiferenciaDeImagenes(): Promise<void> {  
  try {
    new CronJob('* * * * * *',
      async function() {
        const trabajos = await getByTiempoChequeo();
        trabajos.forEach(async (element, index) => {
          const uuid = uuidv4();
          try{
            const browser = await remote(browserConfig);
            logger.info(`Nuevo navegador creado para el trabajo ${element.uuid}: ${browser.sessionId}`);
            // Registrar instancia en el diccionario
            const browserObject: WebDriverObject = {
              browserId: browser.sessionId,
              browser: browser,
              expires: Date.now()
            };
            WebdriverInstances.set(uuid, browserObject);
            const url = element.pagesToTrack?.url as string;
            await browser.url(url);   
            await browser.waitUntil(
              () => browser.execute(() => document.readyState === 'complete'),
              {
                timeout: 20 * 1000, // 20 segundos
                timeoutMsg: 'Error al cargar sitio web'
              }
            );
            await browser.pause(5000);
            const captureSnapshot = new CaptureSnapshot(browser);
            const img = await captureSnapshot.getDevtoolsImage();    
            browser.deleteSession();
            const imageBasePath = element.pagesToTrack?.imageBasePath as string;
            const baseimg = PNG.sync.read(fs.readFileSync(imageBasePath));
            const testPath = path.join(CHECKIMAGE_DIR, `${browser.sessionId}-test.png`);
            // const testimg = PNG.sync.read(await sharp(img).extract({ left: 0, top: 0, width: width, height: height }).png().toBuffer());
            const testimg = PNG.sync.read(img);
            fs.writeFileSync(testPath, PNG.sync.write(testimg), {});
            const realizarDiferencia = new RealizarDiferenciaImagen(baseimg, testimg);
            const imagenFinal = await realizarDiferencia.ejecutar();
            const diferenciaResultante = await realizarDiferencia.getPorcentajeDiferencia();
            const diffPath = path.join(DIFFIMAGE_DIR, `${browser.sessionId}-diff.png`);
            fs.writeFileSync(diffPath, PNG.sync.write(imagenFinal), {});
            // Sumar de nuevo los segundos
            const payload: Partial<InferCreationAttributes<ScheduledTrackingResults>> = {
              imageChequeoPath: testPath,
              imageDiferenciaPath: diffPath,
              diferencia: diferenciaResultante
            };
            await update(element.id, payload);
            await WebdriverInstances.delete(uuid);
            const tiempoLocal = element.tiempoChequeo.toLocaleString('es-ES', { timeZone: 'America/Mexico_City' });
            const descripcion = element.pagesToTrack?.descripcion as string;
            const email = element.userData?.email as string;
            try{
              logger.info(`Enviando correo a ${email}`);
              if(diferenciaResultante > (element.pagesToTrack?.diferenciaAlerta as number)){
                // Enviar correo cuando el porcentaje de diferencia sobrepase la dado por el usuario
                await sendEmailWithAttachments({
                  to: element.userData?.email as string,
                  subject: `Se detectó un cambio en ${url} a las ${tiempoLocal}`,
                  text: generateDifferenceDetectedBodyText(descripcion),
                  html: generateDifferenceDetectedBodyHTML({ url: url, pagina: descripcion, diferencia: `${diferenciaResultante}`, theme: {} }),
                  attachments: [
                    {
                      filename: 'Base.png',
                      path: imageBasePath
                    },
                    {
                      filename: 'Actual.png',
                      path: testPath
                    },
                    {
                      filename: 'Salida.png',
                      path: diffPath
                    }
                    
                  ]
                });
              }
              
            }catch(error){
              logger.error('No se pudo enviar el correo', error);
            }
            
          }catch(browserError) {
            logger.info(`Falló la comprobacion de diferencia`, browserError);
            const browserObject = WebdriverInstances.get(uuid);
            if(browserObject){
              await browserObject.browser.deleteSession();
            }
            WebdriverInstances.delete(uuid);
          }
          
        });
      },
      null,
      true,
      'America/Los_Angeles'
    );
  } catch (error) {
    logger.error(error);
  }
  
}
