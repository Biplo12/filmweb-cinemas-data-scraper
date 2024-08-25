import {
  convertElementsToArray,
  createEmptyCinema,
  createEmptyCinemaGroup,
  createEmptyMovie,
  durationStringToNumber,
  extractTextContentFromSelector,
  fetchPageHtml,
} from "../utils";
import { Cinema, CinemaGroup, Movie } from "../../interfaces";
import { FILMWEB_BASE_URL } from "../../constants";
import {
  FW_CINEMA_CARD_SELECTOR,
  FW_CINEMA_GROUP_SELECTOR,
  FW_CINEMA_GROUP_SELECTORS,
  FW_CINEMA_SELECTORS,
  FW_MOVIE_CARD_SELECTOR,
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
    card.querySelectorAll("div.preview__detail--cast h3")
  );

  if (movie.screeningsHref !== "N/A") {
    movie.screeningsHref = `${FILMWEB_BASE_URL}/${movie.screeningsHref}`;
    movie.movieHref = movie.screeningsHref.split("/showtimes")[0];
  }

  movie.genres = convertElementsToArray(
    card.querySelectorAll("div.preview__genresInHeader h3")
  );

  if (movie.duration) {
    movie.durationInMinutes = durationStringToNumber(movie.duration.toString());
  }

  movie.year = parseInt(movie.year.toString());
  movie.durationInMinutes = parseInt(movie.durationInMinutes.toString());

  delete movie.duration;

  return movie;
};

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

/**
 * @description
 * Function for getting movies and cinemas from Filmweb.
 *
 * @param city - City name.
 *
 * @returns Promise<{ movies: Movie[]; cinemas: Cinema[] }> - Movies and cinemas.
 */
const getFilmwebMoviesAndCinemas = async (
  city: string
): Promise<{ movies: Movie[]; cinemas: Cinema[] }> => {
  const document = await fetchPageHtml(`${FILMWEB_BASE_URL}/showtimes/${city}`);

  const movieCards = document.querySelectorAll(FW_MOVIE_CARD_SELECTOR);
  const cinemaGroupCards = document.querySelectorAll(FW_CINEMA_GROUP_SELECTOR);

  const moviesArray = Array.from(movieCards);

  const movies = await Promise.all(
    moviesArray.map((card) => populateMovieData(card))
  );

  const cinemaGroupCardsArray = Array.from(cinemaGroupCards);
  const cinemasGroups = await Promise.all(
    cinemaGroupCardsArray.map((card) => populateCinemaGroupData(card))
  );

  const cinemas = cinemasGroups.flatMap((group) => group.cinemas);

  return { movies, cinemas };
};

export default getFilmwebMoviesAndCinemas;
