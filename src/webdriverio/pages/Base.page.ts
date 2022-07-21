import random from 'random';
import { ChainablePromiseElement } from 'webdriverio';

abstract class Base {
	protected browser: WebdriverIO.Browser;

	constructor(browser: WebdriverIO.Browser) {
		this.browser = browser;
	}

	public waitRandomTime = async (): Promise<void> => {
		await this.browser.pause(random.int(1000, 1500));
	};
}

export default Base;
