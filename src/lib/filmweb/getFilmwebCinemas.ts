import { FILMWEB_BASE_URL } from "../../constants";
import { Cinema, CinemaGroup } from "../../interfaces";
import {
  createEmptyCinema,
  createEmptyCinemaGroup,
  extractTextContentFromSelector,
} from "../utils";
import {
  FW_CINEMA_CARD_SELECTOR,
  FW_CINEMA_GROUP_SELECTOR,
  FW_CINEMA_GROUP_CITY_SELECTOR,
  FW_CINEMA_SELECTORS,
} from "./selectors";

const populateCinemaData = (card: Element): Cinema => {
  const cinema = createEmptyCinema();

  FW_CINEMA_SELECTORS.forEach(({ key, selector, attribute }) => {
    const value = extractTextContentFromSelector(selector, card, attribute);

    if (key in cinema) {
      (cinema as any)[key] = value;
    }
  });

  const latitude = card.getAttribute("data-cinema-latitude");
  const longitude = card.getAttribute("data-cinema-longitude");

  if (latitude && longitude) {
    cinema.latitude = parseFloat(latitude);
    cinema.longitude = parseFloat(longitude);
  }

  if (cinema.screeningsHref !== "N/A") {
    cinema.screeningsHref = `${FILMWEB_BASE_URL}${cinema.screeningsHref}`;
  }

  return cinema;
};

const populateCinemaGroupData = (card: Element): CinemaGroup => {
  const cinemaGroup = createEmptyCinemaGroup();

  cinemaGroup.city = extractTextContentFromSelector(
    FW_CINEMA_GROUP_CITY_SELECTOR.selector,
    card,
    FW_CINEMA_GROUP_CITY_SELECTOR.attribute
  );

  const cinemasGroupCards = card.querySelectorAll(FW_CINEMA_CARD_SELECTOR);
  const cinemasGroupArray = Array.from(cinemasGroupCards);

  cinemaGroup.cinemas = cinemasGroupArray.map((card) =>
    populateCinemaData(card)
  );

  cinemaGroup.cinemas.forEach((cinema) => {
    cinema.city = cinemaGroup.city;
  });
  return cinemaGroup;
};

/**
 * @description
 * Function for getting cinemas from Filmweb.
 *
 * @param document - Document object containing the HTML.
 *
 * @returns Promise<Cinema[]> - Array of cinemas.
 */
const getFilmwebCinemas = async (document: Document): Promise<Cinema[]> => {
  const cinemaGroupCards = document.querySelectorAll(FW_CINEMA_GROUP_SELECTOR);
  const cinemaGroupCardsArray = Array.from(cinemaGroupCards);

  const cinemasGroups = await Promise.all(
    cinemaGroupCardsArray.map(async (card) => populateCinemaGroupData(card))
  );

  const cinemas = cinemasGroups.flatMap((group) => group.cinemas);

  return cinemas;
};

export default getFilmwebCinemas;
