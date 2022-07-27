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

export const totalplayLogin = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    const browser = await remote;
    await browser.deleteAllCookies();
    await browser.url('https://www.mitotalplay.com.mx');
    await browser.deleteAllCookies();
    await browser.pause(1000);
    await browser.refresh();
    const login: Login = new Login(browser);
    await login.login(TOTALPLAY_USER, TOTALPLAY_PASS);
    await login.waitRandomTime(3000, 4000);
    const dashboard: Dashboard = new Dashboard(browser);
    if(await dashboard.checkLimitSessionReached()){
        await login.login(TOTALPLAY_USER, TOTALPLAY_PASS);
        await login.waitRandomTime(3000, 4000);
    }  
    await dashboard.openLiveVideo();
    res.json({error: false});
};

export const totalplayChannels = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    let requestCookies = '';
    let channels: string[] = [];
    const perCategories:ChannelsArray[] = [];
    // Check if we have logged in
    const browser = await remote;
    if(!(await isLoggedIn(browser))){
        res.status(500).json({error: true, message: 'We haven\'t logged in yet'});
        return;
    }
    const categoriesCookies = await browser.getCookies();
    for(const c of categoriesCookies){
        requestCookies += `${c.name}=${c.value}`;
        requestCookies += '; ';
    }
    for(const i of LiveTV.categories){
        const categoriesResponse = await fetch(`https://totalgo.totalplay.com.mx:444/TPW/LaGuiaNuevaGrid.htm`, {
            method: 'POST',
            body: `idCategoria=${i.value}`,
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
        const sanitized = (await body).match(/(?<=\[)([\S\s]*?)(?=\])/g);
        if(sanitized){
            const channelsArray = sanitized[0].match(/(?<=\")(\d+)(?=\")/g);
            if(channelsArray){
                perCategories.push({name: i.name, categoryId: i.value, channels: channelsArray});
                channels = [ ...channels, ...channelsArray ];
            }      
        }    
    }
    if(channels.length > 0)
        res.json({error: false, channels: channels, perCategories: perCategories});
    else
        res.json({error: true, message: 'No channels found'});    
};

export const totalplayLive = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    const categoryId: number = parseInt(req.params.categoryId);
    const channelId: number = parseInt(req.params.channelId);
    const flashChannel = req.flash('totalplay.previousChannel')[0];
    const flashCategory = req.flash('totalplay.previousCategory')[0];
    // const prevCategory = flashCategory === undefined ? -1 : parseInt((flashCategory as unknown) as string);    
    // let prevChannel = flashChannel === undefined ? channelId : parseInt((flashChannel as unknown) as string);    
    // prevChannel = categoryId == prevCategory ? prevChannel : 2;
    const browser = await remote;
    // Check if we have logged in
    if(!(await isLoggedIn(browser))){
        res.status(500).json({error: true, message: 'We haven\'t logged in yet'});
    }
    req.flash('totalplay.previousChannel', channelId);
    req.flash('totalplay.previousCategory', categoryId);
    const live: LiveTV = new LiveTV(browser);
    await live.mockResponses();
    await live.setChannelsCategory(`${categoryId}`);
    await live.goToChannel(channelId);
    await browser.pause(5000);
    const channelUrl = await live.getChannelUrl();
    const response = await fetch(channelUrl, {
        method: 'get'
    });
    const content = await playlistProcessor(await response.text());
    // change headers
    req.flash('totalplay.playlistContent', content);
    res.set({'Content-Type': 'application/x-mpegurl', 'content-disposition': 'inline;filename=f.txt', 'X-CDN': 'Imperva'});    
    res.send(content);
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
