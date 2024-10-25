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

const parseYonexRacquetDetails = (details) => {
	const parsedDetails = {};
	details.forEach(({ key, value }) => {
		switch (key.toLowerCase()) {
			case "flex":
				switch (value.toLowerCase()) {
					case "hi-flex":
						parsedDetails.flexibility = "extra-flexible";
						break;
					case "flex":
						parsedDetails.flexibility = "flexible";
						break;
					case "medium":
						parsedDetails.flexibility = "medium";
						break;
					case "stiff":
						parsedDetails.flexibility = "stiff";
						break;
					case "hi-stiff":
						parsedDetails.flexibility = "extra-stiff";
						break;
					default:
						parsedDetails.flexibility = "default";
						break;
				}
				break;
			case "frame":
				parsedDetails.frame = value;
				break;
			case "shaft":
				parsedDetails.shaft = value;
				break;
			case "weight / grip":
				parsedDetails.weightGrip = value
					.split(/、/)
					.map((weight) => weight.trim());
				break;
			case "stringing advice":
				parsedDetails.stringTension = value
					.split(/、/)
					.map((tension) => tension.trim());
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

const fetchYonexRacquetDetails = async (page, detailUrl) => {
	try {
		const html = await getPageContent(page, detailUrl);
		const $ = cheerio.load(html);

		// Extract details
		const name = $("h1.page-title").text().trim();
		const details = $("tbody")
			.find("tr")
			.map((index, element) => {
				const key = $(element).find("th").text().trim();
				const value = $(element)
					.find("td")
					.html()
					.replace(/<br>/g, "、");
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
			"racquets",
			"Yonex",
			`${detailUrl.split("/").pop()}.jpg`
		);
		const picturePath = path.join("public", picture);
		// await downloadImage(page, imageUrl, picturePath);

		const parsedDetails = parseYonexRacquetDetails(details);

		return { name, ...parsedDetails, picture, link };
	} catch (error) {
		console.error(`Error fetching details from ${detailUrl}:`, error);
		return null;
	}
};

const scrapeYonexRacquetPage = async (page, html) => {
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
		const details = await fetchYonexRacquetDetails(page, link);
		if (details) {
			scrapedPageData.push(details);
		}
	}

	return scrapedPageData;
};

const scrapeYonexRacquets = async () => {
	let pageUrl = "https://www.yonex.com/badminton/racquets";
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

		const scrapedData = await scrapeYonexRacquetPage(page, html);
		scrapedEquipmentData.push(...scrapedData);

		const $ = cheerio.load(html);
		const nextPage = $("li.item.pages-item-next > a").attr("href");
		pageUrl = nextPage;

		if (!nextPage) {
			hasMorePages = false;
		}
	}

	await saveEquipment(scrapedEquipmentData, "racquets", "Yonex");
	await closeBrowser(browser);
	return scrapedEquipmentData;
};

const run = async () => {
	try {
		await connectDB();
		console.log("Scraping Yonex Racquets...");
		const data = await scrapeYonexRacquets();
		console.log("Scraping completed.");
		console.log(data);
	} catch (error) {
		console.error("Error during scraping:", error);
	}
	process.exit();
};

run();
