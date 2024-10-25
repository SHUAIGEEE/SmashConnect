import {
	launchBrowser,
	closeBrowser,
	getPageContent,
} from "../../utils/puppeteerUtils.js";
import saveEquipment from "../../utils/saveEquipment.js";
import downloadImage from "../../utils/downloadImage.js";
import * as cheerio from "cheerio";
import path from "path";
import connectDB from "../../config/db.js";
import dotenv from "dotenv";
import colors from "colors";

dotenv.config();

const parseYonexShoeDetails = (details) => {
	const parsedDetails = {};
	details.forEach(({ key, value }) => {
		switch (key.toLowerCase()) {
			case "upper":
				parsedDetails.upperMaterial = value;
				break;
			case "midsole":
				parsedDetails.midsoleMaterial = value;
				break;
			case "outsole":
				parsedDetails.outsoleMaterial = value;
				break;
			case "material":
				parsedDetails.technology = value;
				break;
			case "color(s)":
				parsedDetails.colors = value
					.split(/\/\s*/)
					.map((color) => color.trim());
				break;
			default:
				break;
		}
	});

	return parsedDetails;
};

const fetchYonexShoeDetails = async (page, detailUrl) => {
	try {
		const html = await getPageContent(page, detailUrl);
		const $ = cheerio.load(html);

		// Extract details
		const name = $("h1.page-title").text().trim();
		const details = $("tbody")
			.find("tr")
			.map((index, element) => {
				const key = $(element).find("th").text().trim();
				const value = $(element).find("td").text().trim();
				return { key, value };
			})
			.get();
		const imageUrl = $("div.fotorama__stage__shaft > div > img").attr(
			"src"
		);
		const link = detailUrl;

		// Download image
		const picture = path.join(
			"assets",
			"shoes",
			"Yonex",
			`${detailUrl.split("/").pop()}.jpg`
		);
		const picturePath = path.join("public", picture);
		await downloadImage(page, imageUrl, picturePath);

		const parsedDetails = parseYonexShoeDetails(details);

		return { name, ...parsedDetails, picture, link };
	} catch (error) {
		console.error(`Error fetching details from ${detailUrl}:`, error);
		return null;
	}
};

const scrapeYonexShoePage = async (page, html) => {
	const $ = cheerio.load(html);
	const equipmentLinks = [];

	$("a.product-item-link").each((index, element) => {
		const detailUrl = $(element).attr("href");
		if (detailUrl) {
			equipmentLinks.push(detailUrl);
		}
	});

	const scrapedPageData = [];
	for (const link of equipmentLinks) {
		console.log("Scraping link:", link);
		const details = await fetchYonexShoeDetails(page, link);
		if (details) {
			scrapedPageData.push(details);
		}
	}

	return scrapedPageData;
};

const scrapeYonexShoes = async () => {
	let pageUrl = "https://www.yonex.com/badminton/footwear";
	let hasMorePages = true;
	const scrapedEquipmentData = [];

	const browser = await launchBrowser();
	const page = await browser.newPage();

	while (hasMorePages) {
		const html = await getPageContent(page, pageUrl);
		if (!html) {
			hasMorePages = false;
			continue;
		}

		const scrapedData = await scrapeYonexShoePage(page, html);
		scrapedEquipmentData.push(...scrapedData);

		const $ = cheerio.load(html);
		const nextPage = $("li.item.pages-item-next > a").attr("href");
		pageUrl = nextPage;

		if (!nextPage) {
			hasMorePages = false;
		}
	}

	await saveEquipment(scrapedEquipmentData, "shoes", "Yonex");
	await closeBrowser(browser);
	return scrapedEquipmentData;
};

const run = async () => {
	try {
		await connectDB();
		console.log("Scraping Yonex Shoes...");
		const data = await scrapeYonexShoes();
		console.log("Scraping completed.");
		console.log(data);
	} catch (error) {
		console.error("Error during scraping:", error);
	}
	process.exit();
};

run();
