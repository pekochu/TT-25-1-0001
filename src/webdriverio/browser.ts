import { remote } from 'webdriverio';

const browser = (async (): Promise<WebdriverIO.Browser> => {
    return remote({
        capabilities: {
            browserName: 'chrome',
            'goog:chromeOptions': {
                args: ['no-sandbox', 'headless', 'disable-gpu', 'disable-dev-shm-usage', 'disable-notifications', 'window-size=1280,720'],
            },
        },
        logLevel: 'silent',
    });
});    

export default browser();