import Base from './Base.page';
import { ChainablePromiseElement, Mock } from 'webdriverio';

export interface CategoriesChannels{
    name: string;
    value: number;
}

export interface ChannelsArray{
    name: string;
    categoryId: number;
    channels: string[];
}

class LiveTV extends Base {

    // Interceptor variables
    private la_guia_nueva_detalle?: Mock;
	private master_image?: Mock;
	private la_guia_nueva_player?: Mock;

    static categories: CategoriesChannels[] = [
        { name:'Abierta', value: 1 },
        { name:'Entretenimiento', value: 8 },
        { name:'Infantiles', value: 5 },
        { name:'Mundo y Cultura', value: 6 },
        { name:'Cine', value: 7 },
        { name:'Deporte Total', value: 3 },
        { name:'Noticias', value: 2 },
        { name:'Internacionales', value: 9 },
        { name:'Musica', value: 9 },
    ];

	constructor(browser: WebdriverIO.Browser) {
		super(browser);
	}

    get channelsContainer(): ChainablePromiseElement<WebdriverIO.Element> {
		return this.browser.$(`div#newGridGuiaDetalle`);
	} 

    get pauseVideo(): ChainablePromiseElement<WebdriverIO.Element> {
		return this.browser.$(`div.BTpausa`);
	} 

    get channelsCombo(): ChainablePromiseElement<WebdriverIO.Element> {
		return this.browser.$(`div#typeChannelsCombo > select`);
	} 

    get firstChannel(): ChainablePromiseElement<WebdriverIO.Element> {
		return this.browser.$(`//div[contains(@class, 'channelMostrado')][1]`);
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

    public goToChannel = async (channel: number, previous: number): Promise<void> => {
        await (await this.channelsContainer).waitForDisplayed();
        await this.browser.execute('window.scrollTo(0, document.body.scrollHeight);');
        await (await this.firstChannel).waitForDisplayed();
        await (await this.channelsContainer).click();
        const channelElement = await this.browser.$(`//div[@id='canalDiv${channel}']`);
        const upOrDown = channel >= previous ? '\uE00F' : '\uE00E';
        while (!(await channelElement.isDisplayedInViewport())) {
			await (await this.channelsContainer).setValue(upOrDown);
			await this.browser.pause(200);
		}
        await channelElement.waitForExist();
        const liveContent = await this.browser.$(`//div[@id='canalDiv${channel}']//div[@class='showProgressLive']`);
        await liveContent.waitForDisplayed({timeout: 5000});
        await this.waitRandomTime();
        const play = await this.browser.$(`${liveContent.selector}/following-sibling::div[@class='showIconPlay']`);
        await this.waitRandomTime();
        await play.click();
        
    }

    public getChannelUrl = async (): Promise<string> => {
        const html = this.la_guia_nueva_player?.calls.pop();
        if(html != undefined){
            if(await (await this.pauseVideo).isExisting()){
                await (await this.pauseVideo).click();
            }
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

    public setChannelsCategory = async (categoryId: string): Promise<void> => {
		const categoryPicker = await this.channelsCombo;
		await categoryPicker.waitForClickable();
        await categoryPicker.selectByAttribute('value', categoryId);
        await this.waitRandomTime();
	};
}

export default LiveTV;