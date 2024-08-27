import { FILMWEB_BASE_URL } from "../../constants";
import { Cinema, Movie, Screening } from "../../interfaces";
import {
  convertDateStringToDateObject,
  convertElementsToArray,
  createEmptyMovie,
  createEmptyScreening,
  durationStringToNumber,
  extractTextContentFromSelector,
  fetchPageHtmlRequest,
} from "../utils";
import getFilmwebScreeningsDays from "./getFilmwebScreeningsDates";
import {
  FW_MOVIE_GENRES_SELECTOR,
  FW_MOVIE_MAIN_CAST_SELECTOR,
  FW_MOVIE_CARD_SELECTOR,
  FW_SCREENING_SELECTORS,
  FW_MOVIE_SELECTORS,
} from "./selectors";

const populateMovieData = (card: Element): Movie => {
  const movie = createEmptyMovie();

  FW_MOVIE_SELECTORS.forEach(({ key, selector, attribute }) => {
    const value = extractTextContentFromSelector(selector, card, attribute);

    if (key in movie) {
      (movie as any)[key] = value;
    }
  });

  movie.mainCast = convertElementsToArray(
    card.querySelectorAll(FW_MOVIE_MAIN_CAST_SELECTOR)
  );

  movie.genres = convertElementsToArray(
    card.querySelectorAll(FW_MOVIE_GENRES_SELECTOR)
  );

  if (movie.duration) {
    movie.durationInMinutes = durationStringToNumber(movie.duration.toString());
  }

  movie.year = parseInt(movie.year.toString());

  if (movie.screeningsHref !== "N/A") {
    movie.screeningsHref = `${FILMWEB_BASE_URL}${movie.screeningsHref}`;
  }

  delete movie.duration;

  return movie;
};

const populateScreeningData = (card: Element, cinema: Cinema): Screening => {
  const screening = createEmptyScreening();

  FW_SCREENING_SELECTORS.forEach(({ key, selector, attribute }) => {
    const value = extractTextContentFromSelector(selector, card, attribute);

    if (key in screening.screening) {
      (screening.screening as any)[key] = value;
    }
  });

  const movie = populateMovieData(card);
  screening.movie = movie;
  screening.cinema = cinema;

  screening.screening.date = convertDateStringToDateObject(
    screening.screening.date?.toString(),
    screening.screening.time
  );

  return screening;
};

/**
 * @description
 * Function for getting screenings and movies from Filmweb.
 *
 * @param cinema - Cinema object containing the cinema data.
 *
 * @returns Promise<Screening[]> - Array of screenings. Movie is in screening object.
 */
const getFIlmwebMoviesWithScreenings = async (
  cinema: Cinema
): Promise<Screening[]> => {
  const cinemaScreeningDocument = await fetchPageHtmlRequest(
    cinema.screeningsHref
  );

  const screeningsDays = await getFilmwebScreeningsDays(
    cinemaScreeningDocument
  );

  const screenings = await Promise.all(
    screeningsDays.map(async (screeningDay) => {
      const movieDocument = await fetchPageHtmlRequest(
        screeningDay.screeningsHref
      );

      const moviesCards = movieDocument.querySelectorAll(
        FW_MOVIE_CARD_SELECTOR
      );
      const moviesCardsArray = Array.from(moviesCards);

      const screenings = await Promise.all(
        moviesCardsArray.map((card) => populateScreeningData(card, cinema))
      );

      return screenings;
    })
  );

  const flattedScreenings = screenings.flat();

  const filteredScreenings = flattedScreenings.filter(
    (screening) =>
      screening.screening.date instanceof Date &&
      !isNaN(screening.screening.date.getTime())
  );

  return filteredScreenings;
};

export default getFIlmwebMoviesWithScreenings;
