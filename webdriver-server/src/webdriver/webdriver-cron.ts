/* eslint-disable @typescript-eslint/ban-ts-comment */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { diffLines } from 'diff';
import { PNG } from 'pngjs';
import logger from '@project/server/app/util/logger';
import { remote } from 'webdriverio';
import browserConfig from '@project/server/webdriver/browser';
import CaptureSnapshot from '@project/server/webdriver/CaptureSnapshot';
import WebdriverInstances, { WebDriverObject } from '@project/server/webdriver/instances-webdriver';
import { CronJob } from 'cron';
import { getByTiempoChequeo, update } from '@project/server/app/database/services/ScheduledTrackingResultsService';
import { v4 as uuidv4 } from 'uuid';
import { generateDifferenceDetectedBodyText, generateDifferenceDetectedBodyHTML, sendEmailWithAttachments, sendEmail } from '@project/server/app/lib/mail';
import { sendResultNotification, sendTextResultNotification } from '@project/server/app/lib/twilio';
import { SCREENSHOTS_DIR, CHECKIMAGE_DIR, DIFFIMAGE_DIR } from '@project/server/app/util/constants';
import pixelmatch from 'pixelmatch';
import { InferCreationAttributes } from 'sequelize';
import { ScheduledTrackingResults } from '../models';
import RealizarDiferenciaImagen from './RealizarDiferenciaImagen';
import GenerateXpathExpression from '@project/server/webdriver/GenerateXpathExpression';

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
        trabajos.forEach(async (element: any, index) => {
          if(!!element.resultsPage.activo){
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
              const url = new URL(element.resultsPage.url as string);
              await browser.url(url.href);   
              await browser.waitUntil(
                () => browser.execute(() => document.readyState === 'complete'),
                {
                  timeout: 20 * 1000, // 20 segundos
                  timeoutMsg: 'Error al cargar sitio web'
                }
              );

              await browser.pause(parseInt(element.resultsPage.tiempoEspera) * 1000);

              if(element.resultsPage.preacciones !== null){
                for(const accion of element.resultsPage.preacciones){
                  if(accion.value === "" && accion.action === "click") continue;
                  const isXpathValid = (await browser.$$(accion.value)).length > 0;
                  let selectorAlias: string;
                  const xpath = [];
                  if(isXpathValid){
                    xpath.push(accion.value);
                    selectorAlias = accion.value;
                  } else {
                    const generateXpathExpression = new GenerateXpathExpression(browser);
                    selectorAlias = `//*[name(.) and contains(text(), '${accion.value}')]`;
                    const elements = await browser.$$(selectorAlias);
                    console.log(`Elementos encontrados inicialmente: ${elements.length}`);
                    for(const element of elements){
                      const xpathResult = await generateXpathExpression.getXpath(element);
                      xpath.push(xpathResult);   
                    }
                  }
            
                  if(accion.action == 'click'){
                    (await browser.$(xpath[0])).click();
                    await browser.waitUntil(
                      () => browser.execute(() => document.readyState === 'complete'),
                      {
                        timeout: 20 * 1000, // 20 segundos
                        timeoutMsg: 'Error al cargar sitio web'
                      }
                    );
                    (await browser.pause(200));
                  } else if(accion.action == 'doubleclick'){
                    (await browser.$(xpath[0])).doubleClick();
                    await browser.waitUntil(
                      () => browser.execute(() => document.readyState === 'complete'),
                      {
                        timeout: 20 * 1000, // 20 segundos
                        timeoutMsg: 'Error al cargar sitio web'
                      }
                    );
                    (await browser.pause(200));
                  }else if(accion.action == 'wait'){
                    (await browser.pause(parseInt(accion.value) * 1000));
                    await browser.waitUntil(
                      () => browser.execute(() => document.readyState === 'complete'),
                      {
                        timeout: 20 * 1000, // 20 segundos
                        timeoutMsg: 'Error al cargar sitio web'
                      }
                    );
                    (await browser.pause(200));
                  }else if(accion.action == 'refresh'){
                    (await browser.refresh());
                    await browser.waitUntil(
                      () => browser.execute(() => document.readyState === 'complete'),
                      {
                        timeout: 20 * 1000, // 20 segundos
                        timeoutMsg: 'Error al cargar sitio web'
                      }
                    );
                    (await browser.pause(200));
                  }else if(accion.action == 'scroll'){
                    (await browser.scroll(0, 99999));
                    await browser.waitUntil(
                      () => browser.execute(() => document.readyState === 'complete'),
                      {
                        timeout: 20 * 1000, // 20 segundos
                        timeoutMsg: 'Error al cargar sitio web'
                      }
                    );
                    (await browser.pause(200));
                  }else if(accion.action == 'goto'){
                    const url = (accion.value.indexOf('://') === -1) ? 'https://' + accion.value : accion.value;
                    (await browser.url(url));
                    await browser.waitUntil(
                      () => browser.execute(() => document.readyState === 'complete'),
                      {
                        timeout: 20 * 1000, // 20 segundos
                        timeoutMsg: 'Error al cargar sitio web'
                      }
                    );
                    (await browser.pause(200));
                  }
                }
              }
              
              if(element.resultsPage.modo.toLowerCase() === 'visual'){
                logger.info('visual1');
                const captureSnapshot = new CaptureSnapshot(browser);
                await browser.pause(1000);
                logger.info('visual2');
                const img = await captureSnapshot.getDevtoolsImage();    
                logger.info('visual3');
                const imageBasePath = element.resultsPage?.imageBasePath as string;
                const readImageBasePath = fs.readFileSync(imageBasePath);
                let baseimg = undefined;
                if(element.resultsPage?.corte_x !== null && element.resultsPage?.corte_alto !== null){
                  const imgBaseBuffer = await sharp(readImageBasePath)
                    .extract({ left: element.resultsPage?.corte_x, top: element.resultsPage?.corte_y, width: element.resultsPage?.corte_ancho, height: element.resultsPage?.corte_alto })
                    .toBuffer();
                  baseimg = PNG.sync.read(imgBaseBuffer);
                } else {
                  baseimg = PNG.sync.read(readImageBasePath);
                }
                logger.info('visual4');
                const testPath = path.join(CHECKIMAGE_DIR, `${browser.sessionId}-test.png`);
                // const testimg = PNG.sync.read(await sharp(img).extract({ left: 0, top: 0, width: width, height: height }).png().toBuffer());
                let testimg = undefined;
                if(element.resultsPage?.corte_x !== null && element.resultsPage?.corte_alto !== null){
                  const imgBaseBuffer = await sharp(img)
                    .extract({ left: element.resultsPage?.corte_x, top: element.resultsPage?.corte_y, width: element.resultsPage?.corte_ancho, height: element.resultsPage?.corte_alto })
                    .toBuffer();
                  testimg = PNG.sync.read(imgBaseBuffer);
                } else {
                  testimg = PNG.sync.read(img);
                }
                fs.writeFileSync(testPath, PNG.sync.write(testimg), {});
                logger.info('visual5');
                const realizarDiferencia = new RealizarDiferenciaImagen(baseimg, testimg);
                logger.info('visual6');
                const imagenFinal = await realizarDiferencia.ejecutar();
                logger.info('visual7');
                const diferenciaResultante = await realizarDiferencia.getPorcentajeDiferencia();
                const diffPath = path.join(DIFFIMAGE_DIR, `${browser.sessionId}-${Date.now()}-diff.png`);
                fs.writeFileSync(diffPath, PNG.sync.write(imagenFinal), {});
                // Sumar de nuevo los segundos
                const payload: Partial<InferCreationAttributes<ScheduledTrackingResults>> = {
                  imageChequeoPath: testPath,
                  imageDiferenciaPath: diffPath,
                  diferencia: diferenciaResultante
                };
                await update(element.id, payload);
                const tiempoLocal = element.tiempoChequeo.toLocaleString('es-ES', { timeZone: 'America/Mexico_City' });
                const descripcion = element.resultsPage?.descripcion as string;
                const email = element.userResults?.email as string;
                const telefono = element.userResults?.telefono as string;
                // Enviar correo
                if(element.resultsPage?.notifEmail){
                  try{
                    if(diferenciaResultante > (element.resultsPage?.diferenciaAlerta as number)){
                      logger.info(`Enviando correo a ${email}`);
                      // Enviar correo cuando el porcentaje de diferencia sobrepase la dado por el usuario
                      await sendEmailWithAttachments({
                        to: email,
                        subject: `Se detectó un cambio visual en ${url} a las ${tiempoLocal}`,
                        text: generateDifferenceDetectedBodyText(descripcion),
                        html: generateDifferenceDetectedBodyHTML({ url: url.href, pagina: descripcion, diferencia: `${diferenciaResultante}`, theme: {} }),
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
                }
                // Enviar WhatsApp
                if(element.resultsPage?.notifWhatsapp){
                  try{
                    if(diferenciaResultante > (element.resultsPage?.diferenciaAlerta as number)){
                      logger.info(`Enviando whatsapp a ${telefono}`);
                      // Enviar correo cuando el porcentaje de diferencia sobrepase la dado por el usuario
                      await sendResultNotification({
                        telefono: telefono,
                        subject: `Se detectó un cambio visual en ${url} a las ${tiempoLocal}. El porcentaje de cambio detectado es de ${diferenciaResultante}%`,
                        resultId: element.uuid
                      });
                    }
                    
                  }catch(error){
                    logger.error('No se pudo enviar el WhatsApp', error);
                  }
                }
               
              } else {
                const nuevoTexto = await (await browser.$('//body')).getText();
                await browser.pause(1000);
                const baseTexto = element.resultsPage?.texto_analisis;
                const result = diffLines(baseTexto, nuevoTexto);
                let totalLines = 0;
                let addedLines = 0;
                let removedLines = 0;
                for(const diffs of result){
                  totalLines = totalLines + (diffs.count as number);
                  addedLines = addedLines + ((diffs.added) ? (diffs.count as number) : 0);
                  removedLines = removedLines + ((diffs.removed) ? (diffs.count as number) : 0);
                }
                const diferenciaResultante = ((addedLines + removedLines) /totalLines ) * 100;
                const payload: Partial<InferCreationAttributes<ScheduledTrackingResults>> = {
                  nuevo_texto: nuevoTexto,
                  diferencia: diferenciaResultante
                };
                await update(element.id, payload);
                const tiempoLocal = element.tiempoChequeo.toLocaleString('es-ES', { timeZone: 'America/Mexico_City' });
                const descripcion = element.resultsPage?.descripcion as string;
                const email = element.userResults?.email as string;
                const telefono = element.userResults?.telefono as string;
                // Enviar correo
                if(element.resultsPage?.notifEmail){
                  try{
                    if(diferenciaResultante > (element.resultsPage?.diferenciaAlerta as number)){
                      logger.info(`Enviando correo a ${email}`);
                      // Enviar correo cuando el porcentaje de diferencia sobrepase la dado por el usuario
                      await sendEmail({
                        to: email,
                        subject: `Se detectó un cambio de texto en ${url} a las ${tiempoLocal}`,
                        text: generateDifferenceDetectedBodyText(descripcion),
                        html: generateDifferenceDetectedBodyHTML({ url: url.href, pagina: descripcion, diferencia: `${diferenciaResultante}`, theme: {} }),
                      });
                    }
                    
                  }catch(error){
                    logger.error('No se pudo enviar el correo', error);
                  }
                }
                // Enviar WhatsApp
                if(element.resultsPage?.notifWhatsapp){
                  try{
                    if(diferenciaResultante > (element.resultsPage?.diferenciaAlerta as number)){
                      logger.info(`Enviando whatsapp a ${telefono}`);
                      // Enviar correo cuando el porcentaje de diferencia sobrepase la dado por el usuario
                      await sendTextResultNotification({
                        telefono: telefono,
                        subject: `Se detectó un cambio de texto en ${url} a las ${tiempoLocal}. El porcentaje de cambio detectado es de ${diferenciaResultante}%.`
                      });
                    }
                    
                  }catch(error){
                    logger.error('No se pudo enviar el WhatsApp', error);
                  }
                }
              }
              await browser.deleteSession();
              await WebdriverInstances.delete(uuid);            
            }catch(browserError) {
              logger.error(`Falló la comprobacion de diferencia`, browserError);
              const browserObject = WebdriverInstances.get(uuid);
              if(browserObject){
                await browserObject.browser.deleteSession();
              }
              WebdriverInstances.delete(uuid);
            }
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
