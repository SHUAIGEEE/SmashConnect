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

const parseVictorRacquetDetails = (details) => {
	const parsedDetails = {};
	const knownFields = [
		"colour:",
		"weight/ grip size:",
		"string tension:",
		"frame material:",
		"shaft material:",
		"flexibility:",
		"stiffness:",
		"balance:",
	];

	const potentialMultiRowFields = [
		"colour:",
		"weight/ grip size:",
		"string tension:",
	];

	const flexibilityMap = {
		"●○○○○": "extra-stiff",
		"○●○○○": "stiff",
		"○○●○○": "medium",
		"○○○●○": "flexible",
		"○○○○●": "extra-flexible",
	};

	const balanceMap = {
		"●○○○○": "extra-head-heavy",
		"○●○○○": "head-heavy",
		"○○●○○": "even-balance",
		"○○○●○": "head-light",
		"○○○○●": "extra-head-light",
	};

	for (let i = 0; i < details.length; i++) {
		const detail = details[i].toLowerCase().trim();

		if (knownFields.includes(detail)) {
			const value = details[i + 1].trim();
			// Check if the field has multiple values
			const values = [value];
			if (potentialMultiRowFields.includes(detail)) {
				for (let j = i + 2; j < details.length; j++) {
					if (
						!details[j].trim() ||
						knownFields.includes(details[j].toLowerCase().trim())
					) {
						break;
					}
					values.push(details[j].trim());
					i++;
				}
			}

			switch (detail) {
				case "colour:":
					parsedDetails.colors = values;
					break;
				case "weight/ grip size:":
					parsedDetails.weightGrip = values;
					break;
				case "string tension:":
					parsedDetails.stringTension = values;
					break;
				case "frame material:":
					parsedDetails.frame = value;
					break;
				case "shaft material:":
					parsedDetails.shaft = value;
					break;
				case "flexibility:":
				case "stiffness:":
					const flexibilitySymbols = value.match(/[○●]{5}/);
					if (flexibilitySymbols) {
						parsedDetails.flexibility =
							flexibilityMap[flexibilitySymbols[0]] || "default";
					}
					break;
				case "balance:":
					const balanceSymbols = value.match(/[○●]{5}/);
					if (balanceSymbols) {
						parsedDetails.balance =
							balanceMap[balanceSymbols[0]] || "default";
					}
					break;
				default:
					break;
			}

			// Skip the next element since it's the value of the current field
			i++;
		}
	}

	return parsedDetails;
};

const fetchVictorRacquetDetails = async (page, detailUrl) => {
	const baseUrl = "https://www.victorsports.my";
	const finalUrl = baseUrl + detailUrl;
	try {
		const html = await getPageContent(page, finalUrl);
		const $ = cheerio.load(html);

		// Extract details
		const name = $("div.product-details-content.marketplace > div > h3 > a")
			.text()
			.trim();

		// Format: RM xx.xx
		const priceDetails = $(
			"div.product-details-content.marketplace > div.sc-4899ca09-0.bptfmP.price > div.pd-flex > span.new-price"
		)
			.text()
			.trim()
			.slice(2);
		const price = parseFloat(priceDetails);

		const details = $(".fr-view p")
			.toArray()
			.map((element) => {
				return $(element).text().trim();
			});

		const imageUrl = $(
			"div.slick-list > div.slick-track > div[data-index=1] > div > div > div > img"
		).attr("src");

		const link = finalUrl;

		// Download image
		const picture = path.join(
			"assets",
			"racquets",
			"Victor",
			`${detailUrl.split("/").pop()}.jpg`
		);
		const picturePath = path.join("public", picture);
		// await downloadImage(page, imageUrl, picturePath);

		const parsedDetails = parseVictorRacquetDetails(details);

		return { name, price, ...parsedDetails, picture, link };
	} catch (error) {
		console.error(`Error fetching details from ${finalUrl}:`, error);
		return null;
	}
};

const scrapeVictorRacquetPage = async (page, html) => {
	const $ = cheerio.load(html);
	const equipmentLinks = [];

	$("div > div.product-image > a").each((index, element) => {
		const detailUrl = $(element).attr("href");
		if (detailUrl) {
			equipmentLinks.push(detailUrl);
		}
	});

	const scrapedPageData = [];
	for (const link of equipmentLinks) {
		console.log("Scraping link:", link);
		const details = await fetchVictorRacquetDetails(page, link);
		if (details) {
			scrapedPageData.push(details);
		}
	}

	return scrapedPageData;
};

const scrapeVictorRacquets = async () => {
	let pageUrl = "https://www.victorsports.my/collection/rackets";
	const scrapedEquipmentData = [];

	const browser = await launchBrowser();
	const page = await browser.newPage();

	await page.goto(pageUrl, { waitUntil: "networkidle2" });

	let hasMorePages = true;
	let pageNumber = 1;
	while (hasMorePages) {
		pageUrl = page.url();
		const html = await page.content();
		if (!html) {
			hasMorePages = false;
			continue;
		}

		const scrapedData = await scrapeVictorRacquetPage(page, html);
		scrapedEquipmentData.push(...scrapedData);

		await page.goto(pageUrl, { waitUntil: "networkidle2" });
		const nextPageButton = await page.$("li.ant-pagination-next > button");

		if (nextPageButton) {
			const isDisabled = await nextPageButton.evaluate(
				(button) => button.disabled
			);
			if (isDisabled) {
				hasMorePages = false;
			} else {
				await nextPageButton.click();
				await page.waitForNavigation({ waitUntil: "networkidle2" });
				pageNumber++;
			}
		} else {
			hasMorePages = false;
		}
	}

	await saveEquipment(scrapedEquipmentData, "racquets", "Victor");
	await closeBrowser(browser);
	return scrapedEquipmentData;
};

const run = async () => {
	try {
		await connectDB();
		console.log("Scraping Victor Racquets...");
		const data = await scrapeVictorRacquets();
		console.log("Scraping completed.");
		console.log(data);
	} catch (error) {
		console.error("Error during scraping:", error);
	}
	process.exit();
};

run();
