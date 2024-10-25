import fs from "fs";
import puppeteer from "puppeteer";

const downloadImage = async (page, imageUrl, imagePath) => {
    const imagePage = await page.goto(imageUrl);
	const buffer = await imagePage.buffer();

	return new Promise((resolve, reject) => {
		fs.writeFile(imagePath, buffer, (err) => {
			if (err) {
				reject(err);
			} else {
                console.log(`Image saved to ${imagePath}`);
				resolve(true);
			}
		});
	});
};

export default downloadImage;
