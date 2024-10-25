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

const parseVictorShoeDetails = (details) => {
	const parsedDetails = {};
	const knownFields = ["colour:", "outsole:", "midsole:", "upper:"];

	const potentialMultiRowFields = ["colour:"];

	const isField = (detail) =>
		knownFields.some((field) => detail.includes(field));

	for (let i = 0; i < details.length; i++) {
		let detail = details[i].trim();
		let value = "";

		// Check if the detail line contains both the field and value
		const matchedField = knownFields.find((field) =>
			detail.toLowerCase().includes(field)
		);
		let valuePart;

		if (matchedField) {
			// Split the detail into field and value
			let fieldPart;
			[fieldPart, valuePart] = detail.toLowerCase().split(matchedField);
			detail = matchedField.trim();
			value = valuePart ? valuePart.trim() : details[i + 1]?.trim();
		}

		if (knownFields.includes(detail.toLowerCase())) {
			const values = [value];

			// Check if the field has multiple values
			if (potentialMultiRowFields.includes(matchedField)) {
				for (let j = i + 2; j < details.length; j++) {
					if (
						!details[j].trim() ||
						isField(details[j].toLowerCase().trim())
					) {
						break;
					}
					values.push(details[j].trim());
					i++;
				}
			}

			switch (detail.toLowerCase()) {
				case "colour:":
					parsedDetails.colors = values;
					break;
				case "outsole:":
					parsedDetails.outsole = value;
					break;
				case "midsole:":
					parsedDetails.midsole = values.join(" ");
					break;
				case "upper:":
					parsedDetails.upper = values.join(" ");
					break;
				default:
					break;
			}

			// Skip the next element if it was used as a value
			if (!valuePart && details[i + 1]?.trim() === "") {
				i++;
			}
		}
	}

	return parsedDetails;
};

const fetchVictorShoeDetails = async (page, detailUrl) => {
	const baseUrl = "https://www.victorsports.my";
	const finalUrl = baseUrl + detailUrl;
	try {
		const html = await getPageContent(page, finalUrl);
		const $ = cheerio.load(html);

		// Extract details
		const name = $("div.product-details-content.marketplace > div > h3 > a")
			.text()
			.trim();
		if (name.toLowerCase().includes("slipper")) {
			return null;
		}

		// Format: RM xx.xx
		const price = $(
			"div.product-details-content.marketplace > div.sc-4899ca09-0.bptfmP.price > div.pd-flex > span.new-price"
		)
			.text()
			.trim()
			.slice(2);
		const parsedPrice = parseFloat(price);

		const details = $(".fr-view")
			.contents()
			.toArray()
			.map((element) => {
				if (element.type === "tag" && element.name === "br") {
					return "";
				}
				return $(element).text().trim();
			});

		const imageUrl = $(
			"div.slick-list > div.slick-track > div[data-index=1] > div > div > div > img"
		).attr("src");

		const link = finalUrl;

		// Download image
		const picture = path.join(
			"assets",
			"shoes",
			"Victor",
			`${detailUrl.split("/").pop()}.jpg`
		);
		const picturePath = path.join("public", picture);
		await downloadImage(page, imageUrl, picturePath);

		const parsedDetails = parseVictorShoeDetails(details);

		return { name, parsedPrice, ...parsedDetails, picture, link };
	} catch (error) {
		console.error(`Error fetching details from ${finalUrl}:`, error);
		return null;
	}
};

const scrapeVictorShoePage = async (page, html) => {
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
		const details = await fetchVictorShoeDetails(page, link);
		if (details) {
			scrapedPageData.push(details);
		}
	}

	return scrapedPageData;
};

const scrapeVictorShoes = async () => {
	let pageUrl = "https://www.victorsports.my/collection/footwear";
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

		const scrapedData = await scrapeVictorShoePage(page, html);
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

	await saveEquipment(scrapedEquipmentData, "shoes", "Victor");
	await closeBrowser(browser);
	return scrapedEquipmentData;
};

const run = async () => {
	try {
		await connectDB();
		console.log("Scraping Victor Shoes...");
		const data = await scrapeVictorShoes();
		console.log("Scraping completed.");
		console.log(data);
	} catch (error) {
		console.error("Error during scraping:", error);
	}
	process.exit();
};

run();
