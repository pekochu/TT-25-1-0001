'use strict';

import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { Response, Request, NextFunction } from 'express';
import { TOTALPLAY_PASS, TOTALPLAY_USER } from '@app/util/secrets';
import remote from '@webdriver/browser';
import Dashboard from '@webdriver/pages/Dashboard.page';
import Login from '@webdriver/pages/Login.page';
import LiveTV, { ChannelsArray } from '@webdriver/pages/LiveTV.page';

const screenshotpath = './screenshot/';
/**
 * List of API examples.
 * @route GET /api
 */
export const getApi = async (req: Request, res: Response): Promise<void> => {
    res.json('Hello World!');
    const browser = await remote;
    await browser.url('google.com.mx');    
};

export const getIp = async (req: Request, res: Response): Promise<void> => {
    const browser = await remote;
    await browser.url('https://ipinfo.io/json');    
    const content = await browser.$('pre').getText();
    const obj = JSON.parse(content);
    res.json({ip: obj.ip});
};

export const getScreenshot = async (req: Request, res: Response): Promise<void> => {
    const browser = await remote;
    const data = await browser.takeScreenshot();
    
    const img = Buffer.from(data, 'base64');

    res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': img.length
    });
    res.end(img); 
};
