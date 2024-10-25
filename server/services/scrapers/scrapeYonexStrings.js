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

const parseYonexStringDetails = (details) => {
	const parsedDetails = {};
	details.forEach(({ key, value }) => {
		switch (key.toLowerCase()) {
			case "gauge":
				parsedDetails.gauge = value;
				break;
			case "length":
				parsedDetails.length = value;
				break;
			case "core":
				if (
					value.toLowerCase().includes("mains -") ||
					value.toLowerCase().includes("crosses -")
				) {
					parsedDetails.coreMaterial = value
						.split(/(?:mains|crosses)\s*-\s*/)
						.filter((str) => str.trim() !== "")
						.map((str, index) => {
							const prefix =
								index === 0 ? "mains - " : "crosses - ";
							return prefix + str.trim();
						})
						.join("; ");
				} else {
					parsedDetails.coreMaterial = value;
				}
				break;
			case "outer":
				if (
					value.toLowerCase().includes("mains -") ||
					value.toLowerCase().includes("crosses -")
				) {
					parsedDetails.outerMaterial = value
						.split(/(?:mains|crosses)\s*-\s*/)
						.filter((str) => str.trim() !== "")
						.map((str, index) => {
							const prefix =
								index === 0 ? "mains - " : "crosses - ";
							return prefix + str.trim();
						})
						.join("; ");
				} else {
					parsedDetails.outerMaterial = value;
				}
				break;
			case "coating":
				parsedDetails.coating = value;
				break;
			case "color(s)":
				parsedDetails.colors = value
					.split(/\/\s*|,\s*/)
					.map((color) => color.trim());
				break;
			default:
				break;
		}
	});

	return parsedDetails;
};

const fetchYonexStringDetails = async (page, detailUrl) => {
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
			"strings",
			"Yonex",
			`${detailUrl.split("/").pop()}.jpg`
		);
		const picturePath = path.join("public", picture);
		// await downloadImage(page, imageUrl, picturePath);

		const parsedDetails = parseYonexStringDetails(details);

		return { name, ...parsedDetails, picture, link };
	} catch (error) {
		console.error(`Error fetching details from ${detailUrl}:`, error);
		return null;
	}
};

const scrapeYonexStringPage = async (page, html) => {
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
		const details = await fetchYonexStringDetails(page, link);
		if (details) {
			scrapedPageData.push(details);
		}
	}

	return scrapedPageData;
};

const scrapeYonexStrings = async () => {
	let pageUrl = "https://www.yonex.com/badminton/strings";
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

		const scrapedData = await scrapeYonexStringPage(page, html);
		scrapedEquipmentData.push(...scrapedData);

		const $ = cheerio.load(html);
		const nextPage = $("li.item.pages-item-next > a").attr("href");
		pageUrl = nextPage;

		if (!nextPage) {
			hasMorePages = false;
		}
	}

	await saveEquipment(scrapedEquipmentData, "strings", "Yonex");
	await closeBrowser(browser);
	return scrapedEquipmentData;
};

const run = async () => {
	try {
		await connectDB();
		console.log("Scraping Yonex Strings...");
		const data = await scrapeYonexStrings();
		console.log("Scraping completed.");
		console.log(data);
	} catch (error) {
		console.error("Error during scraping:", error);
	}
	process.exit();
};

run();
