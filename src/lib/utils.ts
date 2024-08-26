import puppeteer from "puppeteer";
import { JSDOM } from "jsdom";
import { IS_PRODUCTION } from "../constants/env";
import { Cinema, CinemaGroup, Movie, Screening } from "../interfaces";
import axios from "axios";

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

export const fetchPageHtmlRequest = async (url: string): Promise<Document> => {
  const response = await axios.get(url);
  const html = response.data;

  return convertHtmlToDocument(html);
};

export const capitalizeFirstLetter = (str: string) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const durationStringToNumber = (duration: string): number => {
  const parts = duration.split(" ");
  let totalMinutes = 0;

  parts.forEach((part) => {
    if (part.endsWith("h") || part.endsWith("godz.")) {
      totalMinutes += parseInt(part) * 60;
    } else if (part.endsWith("m") || part.endsWith("min.")) {
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
  attribute?: string,
  attributeToFind?: string
): string => {
  const selectedElement = element.querySelector(selector);

  if (!selectedElement) return "N/A";

  if (attribute) {
    return selectedElement.getAttribute(attribute) || "N/A";
  }

  if (attributeToFind) {
    const attributeValue = selectedElement.getAttribute(attributeToFind);
    if (attributeValue) {
      return selectedElement.textContent?.trim() || "N/A";
    }
  }

  return selectedElement.textContent || "N/A";
};

export const convertHtmlToDocument = (html: string): Document => {
  const dom = new JSDOM(html);
  return dom.window.document;
};

export const convertElementsToArray = (
  elements: NodeListOf<Element> | HTMLCollectionOf<Element>
): string[] => {
  const elementsArray = Array.from(elements);
  return elementsArray.map((el) => el.textContent?.trim() || "");
};

export const convertDateStringToDateObject = (
  dateString?: string,
  timeString?: string
): Date | undefined => {
  if (!dateString || !timeString) return undefined;

  let [year, month, day] = dateString.split("-");
  const [hours, minutes] = timeString.split(":");

  if (day?.toString()?.includes("T")) {
    day = day.toString().split("T")[0];
  }

  const [yearNum, monthNum, dayNum] = [year, month, day].map(Number);
  return new Date(
    Date.UTC(yearNum, monthNum - 1, dayNum, Number(hours), Number(minutes))
  );
};

export const createEmptyScreening = (): Screening => ({
  movie: {
    title: "",
    year: 0,
    duration: "",
    durationInMinutes: 0,
    imagePoster: "",
    director: "",
    description: "",
    mainCast: [],
    genres: [],
    movieHref: "",
  },
  screening: {
    date: new Date(),
    time: "",
    bookingHref: "",
  },
  cinema: {
    name: "",
    city: "",
    latitude: 0,
    longitude: 0,
    screeningsHref: "",
  },
});

export const createEmptyMovie = (): Movie => ({
  title: "",
  year: 0,
  duration: "",
  durationInMinutes: 0,
  imagePoster: "",
  director: "",
  movieHref: "",
  description: "",
  screeningsHref: "",
  mainCast: [],
  genres: [],
});

export const createEmptyCinema = (): Cinema => ({
  name: "",
  city: "",
  screeningsHref: "",
  latitude: 0,
  longitude: 0,
});

export const createEmptyCinemaGroup = (): CinemaGroup => ({
  cinemas: [],
  city: "",
  latitude: 0,
  longitude: 0,
});
