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
import { SCREENSHOTS_DIR, CHECKIMAGE_DIR, DIFFIMAGE_DIR } from '@project/server/app/util/constants';
import pixelmatch from 'pixelmatch';
import { InferCreationAttributes } from 'sequelize';
import { ScheduledTrackingResults } from '../models';

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
            await browser.url(element.pagesToTrack?.url as string);   
            await browser.waitUntil(
              () => browser.execute(() => document.readyState === 'complete'),
              {
                timeout: 20 * 1000, // 20 segundos
                timeoutMsg: 'Error al cargar sitio web'
              }
            );
            const captureSnapshot = new CaptureSnapshot(browser);
            const img = await captureSnapshot.getDevtoolsImage();    
            browser.deleteSession();
            const baseimg = PNG.sync.read(fs.readFileSync(element.pagesToTrack?.imageBasePath as string));
            const { width, height } = baseimg;
            const testPath = path.join(CHECKIMAGE_DIR, `${browser.sessionId}-test.png`);
            const testimg = PNG.sync.read(await sharp(img).extract({ left: 0, top: 0, width: width, height: height }).png().toBuffer());
            fs.writeFileSync(testPath, testimg.data, {});
            const diff = new PNG({ width, height });
            const numDiffPixels = pixelmatch(baseimg.data, testimg.data, diff.data, width, height, { threshold: element.pagesToTrack?.diferenciaAlerta as number });
            const diffPath = path.join(DIFFIMAGE_DIR, `${browser.sessionId}-diff.png`);
            fs.writeFileSync(diffPath, PNG.sync.write(diff), {});
            // Sumar de nuevo los segundos
            const currentDate = new Date();
            currentDate.setSeconds(currentDate.getSeconds() + parseInt(element.pagesToTrack?.frecuencia as string));
            const payload: Partial<InferCreationAttributes<ScheduledTrackingResults>> = {
              imageChequeoPath: testPath,
              imageDiferenciaPath: diffPath
            };
            await update(element.id, payload);
            await WebdriverInstances.delete(uuid);
          }catch(browserError) {
            logger.info(`Falló la comprobacion de diferencia`);
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
