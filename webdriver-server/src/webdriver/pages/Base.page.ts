import random from 'random';
import { ChainablePromiseElement } from 'webdriverio';

abstract class Base {
	protected browser: WebdriverIO.Browser;

	constructor(browser: WebdriverIO.Browser) {
		this.browser = browser;
	}

	public waitRandomTime = async (min = 500, max = 1500): Promise<void> => {
		await this.browser.pause(random.int(min, max));
	};
}

export default Base;
