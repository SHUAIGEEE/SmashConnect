import puppeteer from "puppeteer";

export const launchBrowser = async () => {
	return await puppeteer.launch({ headless: true });
};

export const closeBrowser = async (browser) => {
	return await browser.close();
};

export const getPageContent = async (page, url) => {
	await page.goto(url, { waitUntil: "networkidle2" });
	return await page.content();
};
