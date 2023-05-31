import { RemoteOptions } from 'webdriverio';

export default {
  capabilities: {
    browserName: 'chrome',
    'goog:chromeOptions': {
      args: ['no-sandbox', 'disable-gpu', 'headless', 'disable-dev-shm-usage', 'disable-notifications', 'window-size=1440,1080', '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.5 Safari/605.1.15"'],
    },
  },
  logLevel: 'silent',
} as RemoteOptions;