export interface WebDriverObject {
    browserId: string;
    browser: WebdriverIO.Browser;
    expires: number;
}

export default new Map<string, WebDriverObject>();