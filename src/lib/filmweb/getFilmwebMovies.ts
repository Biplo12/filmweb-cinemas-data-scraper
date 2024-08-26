import {
  convertElementsToArray,
  createEmptyMovie,
  durationStringToNumber,
  extractTextContentFromSelector,
  fetchPageHtmlRequest,
} from "../utils";
import { Movie } from "../../interfaces";
import { FILMWEB_BASE_URL } from "../../constants";
import {
  FW_MOVIE_CARD_SELECTOR,
  FW_MOVIE_GENRES_SELECTOR,
  FW_MOVIE_MAIN_CAST_SELECTOR,
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

  if (movie.screeningsHref !== "N/A") {
    movie.screeningsHref = `${FILMWEB_BASE_URL}/${movie.screeningsHref}`;
  }

  movie.genres = convertElementsToArray(
    card.querySelectorAll(FW_MOVIE_GENRES_SELECTOR)
  );

  if (movie.duration) {
    movie.durationInMinutes = durationStringToNumber(movie.duration.toString());
  }

  movie.year = parseInt(movie.year.toString());
  movie.durationInMinutes = parseInt(movie.durationInMinutes.toString());

  delete movie.duration;

  return movie;
};

/**
 * @description
 * Function for getting movies from Filmweb.
 *
 * @param city - City name.
 *
 * @returns Promise<Movie[]> - Returned movies.
 */
const getFilmwebMovies = async (document: Document): Promise<Movie[]> => {
  const movieCards = document.querySelectorAll(FW_MOVIE_CARD_SELECTOR);

  const moviesArray = Array.from(movieCards);

  const movies = await Promise.all(
    moviesArray.map((card) => populateMovieData(card))
  );

  return movies;
};

export default getFilmwebMovies;
