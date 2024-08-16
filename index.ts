import { FILMWEB_CINEMAS_BASE_URL } from "@/constants";
import axios from "axios";
import {
  capitalizeFirstLetter,
  durationStringToNumber,
  extractMultipleTextContentFromSelectors,
} from "./lib/utils";
import { JSDOM } from "jsdom";

// Function to fetch movies page data
const fetchMoviesPage = async (city: string): Promise<string> => {
  const response = await axios.get(
    `${FILMWEB_CINEMAS_BASE_URL}/${capitalizeFirstLetter(city)}`
  );
  return response.data;
};

// Function to parse HTML string into a Document object
const parseHtmlToDocument = (html: string): Document => {
  const dom = new JSDOM(html);
  return dom.window.document;
};

const extractMovieData = (document: Document) => {
  const selectors = [
    { key: "title", selector: "a.preview__link" },
    { key: "year", selector: "div.preview__year" },
    { key: "duration", selector: "div.preview__duration" },
    { key: "imagePoster", selector: "img.poster__image", attribute: "src" },
    {
      key: "director",
      selector: "div.preview__detail--director h3 a span",
    },
    { key: "description", selector: "div.preview__plotText" },
    { key: "communityRating", selector: "span.communityRatings__value" },
    { key: "criticsRating", selector: "span.communityRatings__value.isHigh" },
  ];

  const extractedData = selectors.reduce(
    (acc, { key, selector, attribute }) => {
      acc[key] = extractMultipleTextContentFromSelectors(
        selector,
        document,
        attribute
      ) as string[];
      return acc;
    },
    {} as Record<string, any>
  );

  const dateSelected = extractMultipleTextContentFromSelectors(
    "li.navList__item--selected",
    document,
    "data-value"
  );

  const films = extractedData.title.map((_: any, index: number) => {
    const film: Record<string, any> = {};
    for (const key in extractedData) {
      film[key] = extractedData[key][index] || "N/A";

      if (key === "duration") {
        film["durationInMinutes"] = durationStringToNumber(
          film[key as keyof typeof film]
        );
      }
    }
    return film;
  });

  return {
    date: dateSelected || "N/A",
    films,
  };
};

const main = async () => {
  try {
    const html = await fetchMoviesPage("Bytom");
    const document = parseHtmlToDocument(html);
    const data = extractMovieData(document);

    console.log("Filtered Data:", JSON.stringify(data.films[10], null, 2));
  } catch (error) {
    console.error("Error fetching or processing data:", error);
  }
};

main();
