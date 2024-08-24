import { MULTIKINO_BASE_URL } from "../../constants";
import { Screening } from "../../interfaces";
import {
  convertDateStringToDateObject,
  createEmptyScreening,
  extractTextContentFromSelector,
} from "../utils";
import {
  MK_SCREENING_DATE_SELECTOR,
  MK_SCREENINGS_ITEM_SELECTOR,
  MK_SCREENINGS_LIST_SELECTOR,
  MK_SCREENINGS_SELECTORS,
} from "./selectors";

const populateScreeningDetails = (screening: Element): Screening[] => {
  const date = extractTextContentFromSelector(
    MK_SCREENING_DATE_SELECTOR.selector,
    screening,
    "datetime"
  );

  const screeningItems = screening.querySelectorAll(
    MK_SCREENINGS_ITEM_SELECTOR
  );

  const screeningItemsArray = Array.from(screeningItems);

  const screeningsDetails = screeningItemsArray.map((item) => {
    const screeningDetails = createEmptyScreening();

    if (date !== "N/A") {
      screeningDetails.screening.date = date;
    }

    MK_SCREENINGS_SELECTORS.forEach(({ key, selector, attribute }) => {
      const value = extractTextContentFromSelector(selector, item, attribute);

      if (key in screeningDetails.screening) {
        (screeningDetails.screening as any)[key] = value;
      }
    });

    // If date and time are not "N/A", convert them to Date object.
    if (screeningDetails.screening.date !== "N/A") {
      const date = screeningDetails.screening.date?.toString();
      const time = screeningDetails.screening.time?.toString();

      screeningDetails.screening.date = convertDateStringToDateObject(
        date,
        time
      );
    }

    if (screeningDetails.screening.bookingHref !== "N/A") {
      screeningDetails.screening.bookingHref = `${MULTIKINO_BASE_URL}${screeningDetails.screening.bookingHref}`;
    }

    return screeningDetails;
  });

  const flatScreenings = screeningsDetails.flat();

  return flatScreenings;
};

/**
 * @description
 * Function for getting screenings from multikino main repertoire page.
 *
 * @param document - Document object containing the HTML of the page.
 * @param movies - Array of movies.
 *
 * @returns Promise<Screening[]> - Array of screenings.
 */
const getMultikinoScreenings = async (
  document: Document
): Promise<Screening[]> => {
  const screeningsCards = document.querySelectorAll(
    MK_SCREENINGS_LIST_SELECTOR
  );

  const screeningsCardsArray = Array.from(screeningsCards);

  const screenings = screeningsCardsArray.map((card) =>
    populateScreeningDetails(card)
  );

  return screenings.flat();
};

export default getMultikinoScreenings;
