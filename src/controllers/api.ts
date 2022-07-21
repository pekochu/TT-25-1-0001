'use strict';

import fs from 'fs';
import path from 'path';
import { Response, Request, NextFunction } from 'express';
// import { webdriver } from '../app';
import Dashboard from '@webdriver/pages/Dashboard.page';
import Login from '@webdriver/pages/Login.page';

/**
 * List of API examples.
 * @route GET /api
 */
export const getApi = (req: Request, res: Response): void => {
    res.json('Hello World!');
};

// export const totalplayLogin = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
//     await webdriver.url('https://www.mitotalplay.com.mx/');
//     const login: Login = new Login(webdriver);
//     await login.login('0101475155', 'RemarRobin@498');
//     await webdriver.pause(4000);
//     const dashboard: Dashboard = new Dashboard(webdriver);
//     if(await dashboard.checkLimitSessionReached()){
//         await login.login('0101475155', 'RemarRobin@498');
//         await webdriver.pause(4000);
//     }
//     if(await webdriver.getCookies(['_ga'][0]) == undefined){
//         res.json({error: true});
//         return;
//     }    
//     await dashboard.ottvLinkClick();
//     await webdriver.pause(3000);
//     await webdriver.closeWindow();
//     await webdriver.pause(3000);
//     await dashboard.ottvLinkClick();
//     await webdriver.pause(3000);
//     res.json({error: false});
// };

// export const totalplayPlaylist = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
//     await webdriver.url('https://www.mitotalplay.com.mx/');
//     const login: Login = new Login(webdriver);
//     await login.login('0101475155', 'RemarRobin@498');
//     await webdriver.pause(4000);
//     const dashboard: Dashboard = new Dashboard(webdriver);
//     if(await dashboard.checkLimitSessionReached()){
//         await webdriver.pause(2000);
//         await login.login('0101475155', 'RemarRobin@498');
//         await webdriver.pause(4000);
//     }
//     if(await webdriver.getCookies(['_ga'][0]) == undefined){
//         res.json({error: true});
//         return;
//     }    
//     await dashboard.openLiveVideo();
//     res.json({error: false});
// };


