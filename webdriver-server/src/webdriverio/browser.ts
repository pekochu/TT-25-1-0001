import { remote } from 'webdriverio';

const browser = (async (): Promise<WebdriverIO.Browser> => {
    return remote({
        capabilities: {
            browserName: 'chrome',
            'goog:chromeOptions': {
                args: ['no-sandbox', 'headless', 'disable-gpu', 'disable-dev-shm-usage', 'disable-notifications', 'window-size=1280,720', '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.5 Safari/605.1.15"'],
            },
        },
        logLevel: 'silent',
    });
});    

export default browser();