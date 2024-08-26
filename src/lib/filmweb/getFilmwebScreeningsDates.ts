import { FILMWEB_BASE_URL } from "../../constants";
import { ScreeningDays } from "../../interfaces";
import {
  createEmptyScreeningDays,
  extractTextContentFromSelector,
} from "../utils";
import {
  FW_SCREENINGS_DAYS_SELECTOR_ITEM,
  FW_SCREENINGS_DAYS_SELECTOR_DISABLED,
  FW_SCREENINGS_DAYS_SELECTOR,
} from "./selectors";

const populateScreeningDaysData = (card: Element) => {
  const screeningsDays = createEmptyScreeningDays();

  screeningsDays.screeningsHref = extractTextContentFromSelector(
    FW_SCREENINGS_DAYS_SELECTOR.selector,
    card,
    FW_SCREENINGS_DAYS_SELECTOR.attribute
  );

  const date = card.getAttribute("data-value");

  if (screeningsDays.screeningsHref !== "N/A") {
    screeningsDays.screeningsHref = `${FILMWEB_BASE_URL}${screeningsDays.screeningsHref}`;
  }

  screeningsDays.date = date ?? "N/A";

  return screeningsDays;
};

/**
 * @description
 * Function for getting screenings days from Filmweb.
 *
 * @param cinema - Cinema object containing the cinema data.
 *
 * @returns Promise<Screening[]> - Array of screenings.
 */
const getFilmwebScreeningsDays = async (
  document: Document
): Promise<ScreeningDays[]> => {
  const screeningsDaysCards = document.querySelectorAll(
    FW_SCREENINGS_DAYS_SELECTOR_ITEM
  );

  // if there is a disabled class remove the card
  const screeningsDaysCardsArray = Array.from(screeningsDaysCards).filter(
    (card) => !card.classList.contains(FW_SCREENINGS_DAYS_SELECTOR_DISABLED)
  );

  const screeningsDays = await Promise.all(
    screeningsDaysCardsArray.map((card) => populateScreeningDaysData(card))
  );

  const filteredScreeningsHref = screeningsDays.filter(
    (screeningDay) => screeningDay.screeningsHref !== "N/A"
  );

  return filteredScreeningsHref;
};

export default getFilmwebScreeningsDays;
