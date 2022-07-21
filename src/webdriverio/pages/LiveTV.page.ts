import Base from './Base.page';
import { ChainablePromiseElement, Mock } from 'webdriverio';

class LiveTV extends Base {

    // Interceptor variables
    private la_guia_nueva_detalle?: Mock;
	private master_image?: Mock;
	private la_guia_nueva_player?: Mock;

	constructor(browser: WebdriverIO.Browser) {
		super(browser);
	}

    get channelsContainer(): ChainablePromiseElement<WebdriverIO.Element> {
		return this.browser.$(`div#newGridGuiaDetalle`);
	} 

    public open = async (): Promise<void> => {
        this.browser.url('https://totalgo.totalplay.com.mx:444/TPW/MiTotalPlay.htm#menuGuiaHorarioNueva.htm');
    };

    public mockResponses = async (): Promise<void> => {
		this.la_guia_nueva_detalle = await this.browser.mock(/(.+)LaGuiaNuevaDetalle.htm/gi, {
			method: 'post',
			statusCode: 200,
		});
        this.master_image = await this.browser.mock(/(.+)MasterImage(.+)/gi, {
			method: 'get',
			statusCode: 200,
		});
        this.la_guia_nueva_player = await this.browser.mock(/(.+)LaGuiaNuevaPlayer.htm/gi, {
			method: 'post',
			statusCode: 200,
		});
	}    

    public goToChannel = async (channel: number): Promise<void> => {
        await (await this.channelsContainer).waitForDisplayed();
        await this.browser.execute('window.scrollTo(0, document.body.scrollHeight);');
        await (await this.channelsContainer).click();
        const channelElement = await this.browser.$(`//div[@id='canalDiv${channel}']`);
        while (!(await channelElement.isDisplayedInViewport())) {
			await (await this.channelsContainer).setValue('\uE015');
			await this.browser.pause(150);
		}
        await channelElement.waitForExist();
        await channelElement.scrollIntoView({
            behavior: 'smooth',
			block: 'end',
        });
        const liveContent = await this.browser.$(`//div[@id='canalDiv${channel}']/div/div[@onclick][last()]`);
        if(await liveContent.isClickable()){
            await liveContent.waitForClickable({timeout: 5000});
            await this.waitRandomTime();
            const selectorPlay = `${liveContent.selector}/div[@class='showIconPlay']`;
            const play = await this.browser.$(selectorPlay);
            await play.click();
        }
        
    }

    public getChannelUrl = async (): Promise<string> => {
        console.log(this.la_guia_nueva_player?.calls);
        const html = this.la_guia_nueva_player?.calls.pop();
        if(html != undefined){
            console.log(html);
            const content: string = html.body as string;
            const result = content.match(/\'(.+)\'/g);
            let hlsUrl = result?.pop();
            if(hlsUrl != undefined){
                hlsUrl = hlsUrl.replace('\'', '').replace('\'', '');
                console.log(`GOT IT: ${hlsUrl}`);
                return hlsUrl;
            }
            return '';            
        }

        return '';
    }
}

export default LiveTV;
