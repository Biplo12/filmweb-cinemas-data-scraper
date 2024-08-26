import { FILMWEB_BASE_URL } from "../../constants";
import { Cinema, Screening } from "../../interfaces";
import {
  convertDateStringToDateObject,
  convertElementsToArray,
  createEmptyScreening,
  durationStringToNumber,
  extractTextContentFromSelector,
  fetchPageHtmlRequest,
} from "../utils";
import {
  FW_MOVIE_GENRES_SELECTOR,
  FW_MOVIE_MAIN_CAST_SELECTOR,
  FW_MOVIE_CARD_SELECTOR,
  FW_SCREENING_SELECTORS,
} from "./selectors";

const populateScreeningData = (card: Element, cinema: Cinema): Screening => {
  const screening = createEmptyScreening();

  FW_SCREENING_SELECTORS.forEach(({ key, selector, attribute }) => {
    const value = extractTextContentFromSelector(selector, card, attribute);

    const keys = key.split(".");
    if (keys.length === 2 && keys[0] in screening) {
      (screening as any)[keys[0]][keys[1]] = value;
    }
  });

  screening.movie.mainCast = convertElementsToArray(
    card.querySelectorAll(FW_MOVIE_MAIN_CAST_SELECTOR)
  );

  screening.movie.genres = convertElementsToArray(
    card.querySelectorAll(FW_MOVIE_GENRES_SELECTOR)
  );

  if (screening.movie.movieHref !== "N/A") {
    const splittedHref = screening.movie.movieHref.split("/showtimes")[0];

    screening.movie.movieHref = `${FILMWEB_BASE_URL}${splittedHref}`;
  }

  if (screening.movie.duration) {
    screening.movie.durationInMinutes = durationStringToNumber(
      screening.movie.duration.toString()
    );
  }

  screening.movie.year = parseInt(screening.movie.year.toString());

  screening.screening.date = convertDateStringToDateObject(
    screening.screening.date?.toString(),
    screening.screening.time
  );

  screening.cinema = cinema;

  delete screening.movie.duration;

  return screening;
};

/**
 * @description
 * Function for getting screenings from Filmweb.
 *
 * @param cinema - Cinema object containing the cinema data.
 *
 * @returns Promise<Screening[]> - Array of screenings.
 */
const getFilmwebScreenings = async (cinema: Cinema): Promise<Screening[]> => {
  const document = await fetchPageHtmlRequest(cinema.screeningsHref);

  const moviesCards = document.querySelectorAll(FW_MOVIE_CARD_SELECTOR);
  const moviesCardsArray = Array.from(moviesCards);

  const screenings = await Promise.all(
    moviesCardsArray.map((card) => populateScreeningData(card, cinema))
  );

  return screenings;
};

export default getFilmwebScreenings;
