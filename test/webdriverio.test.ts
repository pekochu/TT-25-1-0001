import request from 'supertest';
import fs from 'fs';
import path from 'path';
import { remote } from 'webdriverio';
import { expect as chexpect } from 'chai';
import { ENVIRONMENT } from '../src/util/secrets';
import Login from '../src/webdriverio/pages/Login.page';
import Dashboard from '../src/webdriverio/pages/Dashboard.page';
import LiveTV from '../src/webdriverio/pages/LiveTV.page';

let browser: WebdriverIO.Browser;
const screenshotpath = './screenshot/';

describe.skip('WebdriverIO', () => {
    beforeAll(async () => {
        if(!fs.existsSync(path.resolve(screenshotpath))){
            fs.mkdirSync(path.resolve(screenshotpath));
        }else{
            for(const file of fs.readdirSync(path.resolve(screenshotpath))){
                fs.rmSync(path.resolve(`${screenshotpath}${file}`));
            }
        }
        browser = await remote({
            capabilities: {
                browserName: 'chrome',
                'goog:chromeOptions': {
                    args: ['disable-notifications', 'window-size=1280,720'],
                },
            },
            logLevel: 'error',
        });
    });

    afterAll(async () => {
        await browser.deleteSession();
    });

    describe('Load ipinfo.io in Chrome', () => {
        it('should take a screenshot', async () => {
            const start = new Date().getTime();
            await browser.url('https://ipinfo.io');
            const elapsed = new Date().getTime() - start;
            const screenshot = path.resolve(`${screenshotpath}integration-testing_${new Date().getTime()}.png`);
            const screenshotData = await browser.saveScreenshot(screenshot);
            console.log(`Elapsed: ${elapsed}ms`);
            expect(screenshotData).toBeInstanceOf(Buffer);
        });
    });

    describe('Load mitotalplay in Chrome', () => {
        it('should login into account', async () => {
            await browser.url('https://www.mitotalplay.com.mx/');
            const login: Login = new Login(browser);
            await login.login('0101475155', 'RemarRobin@498');
            await browser.pause(4000);
            const dashboard: Dashboard = new Dashboard(browser);
            if(await dashboard.checkLimitSessionReached()){
                await browser.pause(2000);
                await login.login('0101475155', 'RemarRobin@498');
                await browser.pause(4000);
            }
        });

        it('should get the cookies once in account', async () => {
            console.log(await browser.getCookies(['_ga'][0]));
            expect(await browser.getCookies(['_ga'][0])).not.toBeUndefined();
        });

        it('should get into OTTV', async () => {
            const dashboard: Dashboard = new Dashboard(browser);
            await dashboard.openLiveVideo();
            const screenshot = path.resolve(`${screenshotpath}totalplay_${new Date().getTime()}.png`);
            const screenshotData = await browser.saveScreenshot(screenshot);
            expect(screenshotData).toBeInstanceOf(Buffer);
        });

        it('get the channel url', async () => {
            const live: LiveTV = new LiveTV(browser);
            await live.mockResponses();
            await live.goToChannel(105, 105);
            await browser.pause(5000);
            await live.getChannelUrl();
            const screenshot = path.resolve(`${screenshotpath}livetv_${new Date().getTime()}.png`);
            const screenshotData = await browser.saveScreenshot(screenshot);
            expect(screenshotData).toBeInstanceOf(Buffer);
        });
    });
});