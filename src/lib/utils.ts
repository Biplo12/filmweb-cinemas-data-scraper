import puppeteer from "puppeteer";
import { JSDOM } from "jsdom";
import { IS_PRODUCTION } from "../constants/env";
// import axios from "axios";

export const fetchPageHtml = async (
  url: string,
  waitForSelector?: string
): Promise<Document> => {
  try {
    const puppeteerProdSettings = {
      headless: true,
      args: ["--no-sandbox"],
      executablePath: "/usr/bin/chromium-browser",
    };

    const puppeteerDevSettings = {
      headless: true,
      args: ["--no-sandbox"],
    };

    const browser = await puppeteer.launch(
      IS_PRODUCTION ? puppeteerProdSettings : puppeteerDevSettings
    );

    const page = await browser.newPage();

    // Navigate to the page
    await page.goto(url, { waitUntil: "networkidle2" });

    // Wait for a specific element to load (you can adjust the selector)
    if (waitForSelector) {
      await page.waitForSelector(waitForSelector);
    }

    // Extract the page's content
    const pageContent = await page.content();

    await browser.close();
    const document = convertHtmlToDocument(pageContent);

    return document;
  } catch (error) {
    console.error("Error fetching movies page:", error);
    throw error;
  }
};

// export const fetchPageHtml = async (
//   url: string,
//   waitForSelector?: string
// ): Promise<Document> => {
//   try {
//     const response = await axios.get(url);
//     return convertHtmlToDocument(response.data);
//   } catch (error) {
//     console.error("Error fetching movies page:", error);
//     throw error;
//   }
// };

export const capitalizeFirstLetter = (str: string) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const durationStringToNumber = (duration: string): number => {
  const parts = duration.split(" ");
  let totalMinutes = 0;

  parts.forEach((part) => {
    if (part.endsWith("h")) {
      totalMinutes += parseInt(part) * 60;
    } else if (part.endsWith("m")) {
      totalMinutes += parseInt(part);
    }
  });

  return totalMinutes;
};

export const durationNumberToDurationString = (duration: number): string => {
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  return `${hours}h ${minutes}m`;
};

export const extractTextContentFromSelector = (
  selector: string,
  element: Element | Document,
  attribute?: string
): string => {
  const selectedElement = element.querySelector(selector);
  if (!selectedElement) return "N/A";

  if (attribute) {
    return selectedElement.getAttribute(attribute) || "N/A";
  }

  return selectedElement.textContent?.trim() || "N/A";
};

export const convertHtmlToDocument = (html: string): Document => {
  const dom = new JSDOM(html);
  return dom.window.document;
};

export const convertElementsToArray = (
  elements: NodeListOf<Element>
): string[] => Array.from(elements).map((el) => el.textContent?.trim() || "");

export const convertDateStringToDateObject = (
  dateString?: string,
  timeString?: string
): Date | undefined => {
  if (!dateString || !timeString) return undefined;
  const [year, month, day] = dateString.split("-").map(Number);
  const [hours, minutes] = timeString.split(":").map(Number);
  return new Date(Date.UTC(year, month - 1, day, hours, minutes));
};
