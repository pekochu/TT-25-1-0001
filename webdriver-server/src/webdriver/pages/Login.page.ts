import Base from './Base.page';
import { ChainablePromiseElement } from 'webdriverio';

class Login extends Base {
  constructor(browser: WebdriverIO.Browser) {
    super(browser);
  }

  get inputEmail(): ChainablePromiseElement<WebdriverIO.Element> {
    return this.browser.$(`input#log-user`);
  }

  get inputPassword(): ChainablePromiseElement<WebdriverIO.Element> {
    return this.browser.$(`input#log-pass`);
  }

  get buttonSubmit(): ChainablePromiseElement<WebdriverIO.Element> {
    return this.browser.$(`button#log-but-inises`);
  }

  get modalLoad(): ChainablePromiseElement<WebdriverIO.Element> {
    return this.browser.$(`div#modalLoad`);
  }

	public login = async (email: string, password: string): Promise<void> => {
	  await this.inputEmail.waitForEnabled();
	  await this.waitRandomTime();
	  await this.inputEmail.click();
	  for (let i = 0; i < email.length; i++) {
	    await this.browser.keys(email.charAt(i));
	    await this.browser.pause(50);
	  }
	  await this.waitRandomTime();
	  await this.inputPassword.click();
	  for (let i = 0; i < password.length; i++) {
	    await this.browser.keys(password.charAt(i));
	    await this.browser.pause(50);
	  }
	  await this.waitRandomTime();
	  await this.buttonSubmit.click();
	  await this.modalLoad.waitForDisplayed({ reverse: true, timeout: 10000, interval: 800 });
	};
}

export default Login;
