import axios from "axios";
import { JSDOM } from "jsdom";

export const fetchPageHtml = async (url: string): Promise<Document> => {
  try {
    const response = await axios.get(url);
    return convertHtmlToDocument(response.data);
  } catch (error) {
    console.error("Error fetching movies page:", error);
    throw error;
  }
};

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

export const convertHtmlToDocument = (html: string): Document =>
  new JSDOM(html).window.document;

export const convertElementsToArray = (
  elements: NodeListOf<Element>
): string[] => Array.from(elements).map((el) => el.textContent?.trim() || "");
