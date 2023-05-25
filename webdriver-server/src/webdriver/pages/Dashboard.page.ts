import Base from './Base.page';
import LiveTV from './LiveTV.page';
import { ChainablePromiseElement } from 'webdriverio';

class Dashboard extends Base {
  constructor(browser: WebdriverIO.Browser) {
    super(browser);
  }

  get welcomeName(): ChainablePromiseElement<WebdriverIO.Element> {
    return this.browser.$(`div#titMWel`);
  }

  get ottvLink(): ChainablePromiseElement<WebdriverIO.Element> {
    return this.browser.$(`a#ott-tv-link`);
  }

  get sessionsLimit(): ChainablePromiseElement<WebdriverIO.Element> {
    return this.browser.$(`//div[@id = 'mostrarSessiones']`);
  }

  get closeAllSessions(): ChainablePromiseElement<WebdriverIO.Element> {
    return this.browser.$(`//button[contains(@class, 'out_all')]`);
  }

  get confirmCloseAllSessions(): ChainablePromiseElement<WebdriverIO.Element> {
    return this.browser.$(`//button[normalize-space()='Si, cerrar sesiones']`);
  }

  get gotItButton(): ChainablePromiseElement<WebdriverIO.Element> {
    return this.browser.$(`//button[@id='btnRegresarLogin']`);
  }

	public ottvLinkClick = async (): Promise<void> => {
	  await this.ottvLink.waitForClickable({ timeout: 6000 });
	  this.ottvLink.click();
	}

	public checkLimitSessionReached = async (): Promise<boolean> => {
	  try{
	    if(await (await this.sessionsLimit).waitForDisplayed({ timeout: 6000 })){
	      console.log('Closing all sessions now...');
	      await this.waitRandomTime();
	      await (await this.closeAllSessions).click();
	      await (await this.confirmCloseAllSessions).waitForClickable();
	      await this.waitRandomTime();
	      await (await this.confirmCloseAllSessions).click();
	      await (await this.gotItButton).waitForClickable({ timeout: 10000 });
	      await this.waitRandomTime();
	      await (await this.gotItButton).click();
	      return true;
	    }			
	  } catch (e){
	    console.log('Logged in successfully.');
	  } 

	  return false;
	}

	public openLiveVideo = async (): Promise<LiveTV> => {
	  const firstWindowHandle = await this.browser.getWindowHandle();
	  await this.ottvLinkClick();
	  await this.waitRandomTime(1500, 2000);
	  await this.browser.closeWindow();
	  await this.waitRandomTime(1500, 2000);
	  await this.ottvLinkClick();
	  const livetv = new LiveTV(this.browser);
	  await this.waitRandomTime(1500, 2000);
	  await this.browser.switchToWindow(firstWindowHandle);
	  await this.waitRandomTime(1500, 2000);
	  await this.browser.closeWindow();
	  await this.waitRandomTime(1500, 2000);
	  await livetv.pauseTransmission();
	  return livetv;
	}
}

export default Dashboard;
