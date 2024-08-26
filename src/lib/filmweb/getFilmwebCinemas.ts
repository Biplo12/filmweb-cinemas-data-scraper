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
  FW_CINEMA_GROUP_SELECTORS,
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

  if (cinema.screeningsHref !== "N/A") {
    cinema.screeningsHref = `${FILMWEB_BASE_URL}${cinema.screeningsHref}`;
  }

  return cinema;
};

const populateCinemaGroupData = (card: Element): CinemaGroup => {
  const cinemaGroup = createEmptyCinemaGroup();

  FW_CINEMA_GROUP_SELECTORS.forEach(({ key, selector, attribute }) => {
    const value = extractTextContentFromSelector(selector, card, attribute);
    if (key in cinemaGroup) {
      (cinemaGroup as any)[key] = value;
    }
  });

  cinemaGroup.cinemas = Array.from(
    card.querySelectorAll(FW_CINEMA_CARD_SELECTOR)
  ).map((card) => populateCinemaData(card));

  cinemaGroup.cinemas.forEach((cinema) => {
    cinema.city = cinemaGroup.city;
    cinema.latitude = parseFloat(cinemaGroup.latitude.toString());
    cinema.longitude = parseFloat(cinemaGroup.longitude.toString());
  });

  return cinemaGroup;
};

const getFilmwebCinemas = async (document: Document): Promise<Cinema[]> => {
  const cinemaGroupCards = document.querySelectorAll(FW_CINEMA_GROUP_SELECTOR);
  const cinemaGroupCardsArray = Array.from(cinemaGroupCards);

  const cinemasGroups = await Promise.all(
    cinemaGroupCardsArray.map(async (card) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return populateCinemaGroupData(card);
    })
  );

  const cinemas = cinemasGroups.flatMap((group) => group.cinemas);

  return cinemas;
};

export default getFilmwebCinemas;
