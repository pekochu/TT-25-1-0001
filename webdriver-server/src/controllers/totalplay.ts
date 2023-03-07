'use strict';

import fetch from 'node-fetch';
import { Response, Request, NextFunction } from 'express';
import { TOTALPLAY_PASS, TOTALPLAY_USER } from '@project/server/app/util/secrets';
import remote from '@project/server/webdriver/browser';
import Dashboard from '@project/server/webdriver/pages/Dashboard.page';
import Login from '@project/server/webdriver/pages/Login.page';
import LiveTV, { ChannelsArray, Select2Results } from '@project/server/webdriver/pages/LiveTV.page';

export const totalplayLogin = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    const browser = await remote;
    await browser.deleteAllCookies();
    await browser.url('https://www.mitotalplay.com.mx');
    await browser.deleteAllCookies();
    await browser.pause(1000);
    await browser.refresh();
    const login: Login = new Login(browser);
    await login.login(TOTALPLAY_USER, TOTALPLAY_PASS);
    const dashboard: Dashboard = new Dashboard(browser);
    if(await dashboard.checkLimitSessionReached()){
        await login.login(TOTALPLAY_USER, TOTALPLAY_PASS);
        await login.waitRandomTime(3000, 4000);
    }  
    await dashboard.openLiveVideo();
    res.json({error: false});
};

export const totalplayCategories = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Check if we have logged in
    const browser = await remote;
    if(!(await isLoggedIn(browser))){
        res.status(500).json({error: true, message: 'We haven\'t logged in yet'});
        return;
    }
    
    res.json({error: false, categories: LiveTV.categories});
};

export const totalplayChannels = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    let requestCookies = '';
    let channels: string[] = [];
    const select2: Select2Results[] = [];
    // Check if we have logged in
    const browser = await remote;
    if(!(await isLoggedIn(browser))){
        res.status(500).json({error: true, message: 'We haven\'t logged in yet'});
        return;
    }
    const categoryId: number = parseInt(req.params.categoryId);
    const categoriesCookies = await browser.getCookies();
    for(const c of categoriesCookies){
        requestCookies += `${c.name}=${c.value}`;
        requestCookies += '; ';
    }
    // Get channels
    const categoriesResponse = await fetch(`https://totalgo.totalplay.com.mx:444/TPW/LaGuiaNuevaGrid.htm`, {
        method: 'POST',
        body: `idCategoria=${categoryId}`,
        headers: {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            cookie: requestCookies,
            origin: 'https://totalgo.totalplay.com.mx:444',
            referer: 'https://totalgo.totalplay.com.mx:444/TPW/MiTotalPlay.htm',
            'sec-ch-ua': '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
            'sec-ch-ua-platform': ' "Windows"',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
            'x-requested-with': 'XMLHttpRequest'
        }
    });
    const body = await categoriesResponse.text();
    const sanitized = body.match(/(?<=\[)([\S\s]*?)(?=\])/g);
    if(sanitized){
        const channelsArray = sanitized[0].match(/(?<=\")(\d+)(?=\")/g);
        if(channelsArray){
            channels = [ ...channels, ...channelsArray ];
            let categoryName = 'Not found';
            // Get category name
            for(const category of LiveTV.categories){
                if(category.value == categoryId){
                    categoryName = category.name;
                    break;
                }
            }
            // Build select2 data
            let counter = 0;
            for(const c of channelsArray){
                let logoChannel = '3277';
                // Get timeline
                const channelTimelineResponse = await fetch(`https://totalgo.totalplay.com.mx:444/TPW/LaGuiaNuevaCanalTimeLine.htm`, {
                    method: 'POST',
                    body: `canal=${c}&diasMas=0&diasMenos=0`,
                    headers: {
                        accept: '*/*',
                        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        cookie: requestCookies,
                        origin: 'https://totalgo.totalplay.com.mx:444',
                        referer: 'https://totalgo.totalplay.com.mx:444/TPW/MiTotalPlay.htm',
                        'sec-ch-ua': '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
                        'sec-ch-ua-platform': ' "Windows"',
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
                        'x-requested-with': 'XMLHttpRequest'
                    }
                });
                // Get live code
                const timelineBody = await channelTimelineResponse.text();
                const timelineSanitized = [...timelineBody.matchAll(new RegExp(`(event, ${c.trim()}, )(\\d+)(,([\\S\\s]+?)(.+?))(\'true\', \'true\')`, 'g'))];
                if(timelineSanitized){ 
                    const liveCodeMatch = timelineSanitized[timelineSanitized.length - 1];
                    if(liveCodeMatch){
                        // Get channel logo
                        const logoSanitized = [...timelineBody.matchAll(/mimId=(\d+)/gi)];
                        if(logoSanitized){
                            logoChannel = logoSanitized[0][1];
                        }
                        // Get current program name
                        const liveCode = liveCodeMatch[2].trim();
                        const currentProgram = [...timelineBody.matchAll(new RegExp(`(data-id\=\"${liveCode.trim()}\")([\\S\\s]+?)(.+)(data\-name\=\"(.+?)\")`, 'g'))];
                        if(currentProgram){
                            const currentProgramName = currentProgram[0][5];
                            select2.push({id: counter++, categoryId: categoryId, categoryName: categoryName, channel: c, imgSrc: logoChannel, liveCode: liveCode, currentProgram: currentProgramName});
                        }else{
                            select2.push({id: counter++, categoryId: categoryId, categoryName: categoryName, channel: c, imgSrc: logoChannel, liveCode: liveCode, currentProgram: 'Sin información'});
                        }
                    }else{
                        select2.push({id: counter++, categoryId: categoryId, categoryName: categoryName, channel: c, imgSrc: logoChannel});
                    }
                }else{
                    select2.push({id: counter++, categoryId: categoryId, categoryName: categoryName, channel: c, imgSrc: logoChannel});
                }
            }
        }      
    }    

    // Send response
    if(channels.length > 0){
        res.json({error: false, channels: channels, select2: select2 });
    } else
        res.json({error: true, message: 'No channels found'});    
};

export const totalplayCurrent = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    let requestCookies = '';
    // Check if we have logged in
    const browser = await remote;
    if(!(await isLoggedIn(browser))){
        res.status(500).json({error: true, message: 'We haven\'t logged in yet'});
        return;
    }
    const channelId: number = parseInt(req.params.channelId);
    const programId: number = parseInt(req.params.programId);
    const categoriesCookies = await browser.getCookies();
    for(const c of categoriesCookies){
        requestCookies += `${c.name}=${c.value}`;
        requestCookies += '; ';
    }

    const categoriesResponse = await fetch(`https://totalgo.totalplay.com.mx:444/TPW/LaGuiaNuevaDetalle.htm`, {
        method: 'POST',
        body: `idCanal=${channelId}&fecha=0&idPrograma=${programId}`,
        headers: {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            cookie: requestCookies,
            origin: 'https://totalgo.totalplay.com.mx:444',
            referer: 'https://totalgo.totalplay.com.mx:444/TPW/MiTotalPlay.htm',
            'sec-ch-ua': '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
            'sec-ch-ua-platform': ' "Windows"',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
            'x-requested-with': 'XMLHttpRequest'
        }
    });
    const body = categoriesResponse.text();
    
    res.send(body);   
};

export const totalplayLive = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    let requestCookies = '';
    // Check if we have logged in
    const browser = await remote;
    if(!(await isLoggedIn(browser))){
        res.status(500).json({error: true, message: 'We haven\'t logged in yet'});
        return;
    }
    const channelId: number = parseInt(req.params.channelId);
    const programId: number = parseInt(req.params.programId);
    const categoriesCookies = await browser.getCookies();
    for(const c of categoriesCookies){
        requestCookies += `${c.name}=${c.value}`;
        requestCookies += '; ';
    }
    // Get the live url
    const playerResponse = await fetch(`https://totalgo.totalplay.com.mx:444/TPW/LaGuiaNuevaPlayer.htm`, {
        method: 'POST',
        body: `idprograma=${programId}&eslive=1&idCanal=${channelId}`,
        headers: {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            cookie: requestCookies,
            origin: 'https://totalgo.totalplay.com.mx:444',
            referer: 'https://totalgo.totalplay.com.mx:444/TPW/MiTotalPlay.htm',
            'sec-ch-ua': '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
            'sec-ch-ua-platform': ' "Windows"',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
            'x-requested-with': 'XMLHttpRequest'
        }
    });
    const playerBody = await playerResponse.text();
    const playerSanitized = [...playerBody.matchAll(/OpenHls\(\'(.+?)\'/gi)];
    if(playerSanitized){
        const liveUrl = playerSanitized[0][1];
        const liveUrlResponse = await fetch(liveUrl, {
            method: 'GET',
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                cookie: requestCookies,
                origin: 'https://totalgo.totalplay.com.mx:444',
                referer: 'https://totalgo.totalplay.com.mx:444/TPW/MiTotalPlay.htm',
                'sec-ch-ua': '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
                'sec-ch-ua-platform': ' "Windows"',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
                'x-requested-with': 'XMLHttpRequest'
            }
        });
        const content = await playlistProcessor(await liveUrlResponse.text());
        // change headers
        req.flash('totalplay.playlistContent', content);
        res.set({'Content-Type': 'application/x-mpegurl', 'content-disposition': 'inline;filename=f.txt', 'X-CDN': 'Imperva'});    
        res.send(content);
    }
};

export const totalplayLiveCache = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    const flashPlaylist = req.flash('totalplay.playlistContent')[0];
    if(flashPlaylist === undefined){
        res.status(500).json({error: true, message: 'Still no playlist'});
    }else{
        const content = ((flashPlaylist as unknown) as string);
        res.set({'Content-Type': 'application/x-mpegurl', 'content-disposition': 'inline;filename=f.txt', 'X-CDN': 'Imperva'});    
        res.send(content);
    }    
};

export const totalplayChannelLogo = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    const channelLogoId: number = parseInt(req.params.channelLogoId);
    const imageResponse = await fetch(`https://totalgo.totalplay.com.mx:444/TPCOREWeb/MasterImage?mimId=${channelLogoId}`, {
        method: 'get'
    });
    // 3277
    const img = await imageResponse.buffer();
    res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': img.length
    });
    res.end(img); 
};

export const totalplayHeartbeat = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    const browser = await remote;
    if(!(await isLoggedIn(browser))){
        res.status(500).json({error: true, message: 'Need to re-login'});
        return;
    }

    res.json({error: false, message: 'All good :)'});
};

const isLoggedIn = async(browser: WebdriverIO.Browser): Promise<boolean> => {
    const cookies = await browser.getCookies(['sessionTPUser']);
    return cookies.length !== 0;
};

const playlistProcessor = async(content: string): Promise<string> => {
    let playlist = content;
    const lines = playlist.split(/\r\n|\r|\n/);
    if(lines.length == 6){
        // UNLOCK HD
        const hdPlaylist = lines[4].replace('PROFILE03.m3u8', 'PROFILE05.m3u8');
        const hdAvailable = await fetch(hdPlaylist, {
            method: 'get'
        });
        
        if(hdAvailable.status != 404){
            console.log('HD Unlocked');
            playlist = playlist + '#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=4242784,RESOLUTION=1920x1080,CODECS="avc1.4d4028,mp4a.40.5"';
            playlist = playlist + '\r\n';
            playlist = playlist + hdPlaylist;
        }        
    }
    return playlist;
};

const playlistModified = async(content: string): Promise<string> => {
    const playlist = content;
    const lines = playlist.split(/\r\n|\r|\n/);
    console.log(`number of lines: ${lines.length}`);
    const tokenRegex = /vxttoken\=(.+)\//g;
    let modifiedPlaylist = '';
    for(const l of lines){
        if(l.startsWith('https://')){
            const encodedstr = tokenRegex.exec(l);
            if(encodedstr){
                let decodedstr = decodeb64(encodedstr[1]);
                decodedstr = decodedstr.replace(/CANAL(\d+)/g, 'CANAL205');
                const replacedstr = encodeb64(decodedstr);
                modifiedPlaylist += l.replace(/vxttoken\=(.+)\//g, `vxttoken=${replacedstr}/`).replace(/CANAL(\d+)/g, 'CANAL205');
            }
        }else{
            modifiedPlaylist += l;
        }
        modifiedPlaylist += '\r\n';
    }
    const mlines = content.split(/\r\n|\r|\n/);
    if(mlines.length == 6){
        // UNLOCK HD
        const hdPlaylist = mlines[4].replace('PROFILE03.m3u8', 'PROFILE05.m3u8');
        const hdAvailable = await fetch(hdPlaylist, {
            method: 'get'
        });
        
        if(hdAvailable.status != 404){
            console.log('HD Unlocked');
            modifiedPlaylist = modifiedPlaylist + '#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=4242784,RESOLUTION=1920x1080,CODECS="avc1.4d4028,mp4a.40.5"';
            modifiedPlaylist = modifiedPlaylist + '\r\n';
            modifiedPlaylist = modifiedPlaylist + hdPlaylist;
        }        
    }
    return modifiedPlaylist;
};

const encodeb64 = (str: string): string => Buffer.from(str, 'binary').toString('base64');
const decodeb64 = (str: string): string => Buffer.from(str, 'base64').toString();
  

// @Deprecated
// export const totalplayLive = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
//     const categoryId: number = parseInt(req.params.categoryId);
//     const channelId: number = parseInt(req.params.channelId);
//     const flashChannel = req.flash('totalplay.previousChannel')[0];
//     const flashCategory = req.flash('totalplay.previousCategory')[0];
//     // const prevCategory = flashCategory === undefined ? -1 : parseInt((flashCategory as unknown) as string);    
//     // let prevChannel = flashChannel === undefined ? channelId : parseInt((flashChannel as unknown) as string);    
//     // prevChannel = categoryId == prevCategory ? prevChannel : 2;
//     const browser = await remote;
//     // Check if we have logged in
//     if(!(await isLoggedIn(browser))){
//         res.status(500).json({error: true, message: 'We haven\'t logged in yet'});
//     }
//     req.flash('totalplay.previousChannel', channelId);
//     req.flash('totalplay.previousCategory', categoryId);
//     const live: LiveTV = new LiveTV(browser);
//     await live.mockResponses();
//     await live.setChannelsCategory(`${categoryId}`);
//     await live.goToChannel(channelId);
//     await browser.pause(5000);
//     const channelUrl = await live.getChannelUrl();
//     const response = await fetch(channelUrl, {
//         method: 'get'
//     });
//     const content = await playlistProcessor(await response.text());
//     // change headers
//     req.flash('totalplay.playlistContent', content);
//     res.set({'Content-Type': 'application/x-mpegurl', 'content-disposition': 'inline;filename=f.txt', 'X-CDN': 'Imperva'});    
//     res.send(content);
// };