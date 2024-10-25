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

const parseVictorStringDetails = (details) => {
	const parsedDetails = {};
	const knownFields = ["colour:", "size:", "material:"];

	const potentialMultiRowFields = ["colour:"];

	const sizeRegex = /(\d+(\.\d+)?)(\s*mm?)?\s*x\s*(\d+(\.\d+)?)(\s*m?)?/i;

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
				case "size:":
					const match = value.match(sizeRegex);
					if (match) {
						parsedDetails.gauge = match[1]
							? match[1] + (match[3] || "")
							: null; // includes unit if present
						parsedDetails.length = match[4]
							? match[4] + (match[6] || "")
							: null; // includes unit if present
					}
					break;
				case "material:":
					parsedDetails.coreMaterial = value;
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

const fetchVictorStringDetails = async (page, detailUrl) => {
	const baseUrl = "https://www.victorsports.my";
	const finalUrl = baseUrl + detailUrl;
	try {
		const html = await getPageContent(page, finalUrl);
		const $ = cheerio.load(html);

		// Extract details
		const name = $("div.product-details-content.marketplace > div > h3 > a")
			.text()
			.trim();
		if (
			name.toLowerCase().includes("stringing service") ||
			name.toLowerCase().includes("string roll")
		) {
			return null;
		}

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
			"div.slick-list > div.slick-track > div[data-index=0] > div > div > div > img"
		).attr("src");

		const link = finalUrl;

		// Download image
		const picture = path.join(
			"assets",
			"strings",
			"Victor",
			`${detailUrl.split("/").pop()}.jpg`
		);
		const picturePath = path.join("public", picture);
		await downloadImage(page, imageUrl, picturePath);

		const parsedDetails = parseVictorStringDetails(details);

		return { name, price, ...parsedDetails, picture, link };
	} catch (error) {
		console.error(`Error fetching details from ${finalUrl}:`, error);
		return null;
	}
};

const scrapeVictorStringPage = async (page, html) => {
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
		const details = await fetchVictorStringDetails(page, link);
		if (details) {
			scrapedPageData.push(details);
		}
	}

	return scrapedPageData;
};

const scrapeVictorStrings = async () => {
	let pageUrl = "https://www.victorsports.my/collection/strings";
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

		const scrapedData = await scrapeVictorStringPage(page, html);
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

	await saveEquipment(scrapedEquipmentData, "strings", "Victor");
	await closeBrowser(browser);
	return scrapedEquipmentData;
};

const run = async () => {
	try {
		await connectDB();
		console.log("Scraping Victor Strings...");
		const data = await scrapeVictorStrings();
		console.log("Scraping completed.");
		console.log(data);
	} catch (error) {
		console.error("Error during scraping:", error);
	}
	process.exit();
};

run();
