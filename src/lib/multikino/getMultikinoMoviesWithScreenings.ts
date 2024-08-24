import { MULTIKINO_BASE_URL } from "../../constants";
import { Movie, Screening } from "../../interfaces";
import {
  createEmptyMovie,
  durationStringToNumber,
  extractTextContentFromSelector,
  fetchPageHtml,
} from "../utils";
import getMultikinoScreenings from "./getMultikinoScreenings";
import {
  MK_MOVIES_LIST_CARDS_SELECTOR,
  MK_MOVIE_DETAILS_SELECTORS,
  MK_MOVIES_LIST_CARD_SELECTOR,
  MK_SCREENINGS_LIST_SELECTOR,
  MK_MOVIE_DETAILS_INFO_LIST_SELECTOR,
} from "./selectors";

// Function for getting movie details info without class name, based on the index of the elements.
const populateMovieDetailsInfo = (movieDetails: Document) => {
  const movieDetailsInfo = movieDetails.querySelectorAll(
    MK_MOVIE_DETAILS_INFO_LIST_SELECTOR
  );

  const movieDetailsInfoMap = {
    year: "",
    director: "",
    duration: "",
    mainCast: "",
  };

  const movieDetailsInfoArray = Array.from(movieDetailsInfo);

  // Processing movie details info to Movie interface.
  Object.keys(movieDetailsInfoMap).forEach((key, index) => {
    const typedKey = key as keyof typeof movieDetailsInfoMap;
    const textContent = movieDetailsInfoArray[index]?.textContent ?? "N/A";
    movieDetailsInfoMap[typedKey] = textContent;
  });

  return movieDetailsInfoMap;
};

// Function for getting movie details from movie details page and processing them to Movie interface.
const populateMoviesAndScreeningsDetails = async (
  movie: Movie
): Promise<{ movie: Movie; screenings: Screening[] }> => {
  const movieDetails = await fetchPageHtml(
    movie.movieHref,
    MK_SCREENINGS_LIST_SELECTOR
  );

  MK_MOVIE_DETAILS_SELECTORS.forEach(({ key, selector, attribute }) => {
    const value = extractTextContentFromSelector(
      selector,
      movieDetails,
      attribute
    );

    if (key in movie) {
      (movie as any)[key] = value;
    }
  });

  const movieDetailsInfo = populateMovieDetailsInfo(movieDetails);
  Object.assign(movie, movieDetailsInfo);

  const splitYear = movie.year.toString().split(" ");
  movie.year = Number(splitYear[splitYear.length - 1]);

  const durationInMinutes = durationStringToNumber(movie.duration);
  movie.durationInMinutes = durationInMinutes;

  const mainCastArray = movie.mainCast.toString().split(", ");
  movie.mainCast = mainCastArray.map((actor: string) => actor.trim());

  movie.screeningsHref = movie.movieHref;

  const screenings = await getMultikinoScreenings(movieDetails);

  screenings.forEach((screening) => {
    screening.movie = movie;
  });

  return { movie, screenings };
};

const populateMultikinoMovieBasicDetails = async (
  card: Element,
  city: string
): Promise<Movie> => {
  const movie = createEmptyMovie();

  // Only title and movieHref are needed from main repertoire page. Href for request to movie details page.
  MK_MOVIES_LIST_CARD_SELECTOR.forEach(({ key, selector, attribute }) => {
    const value = extractTextContentFromSelector(selector, card, attribute);

    if (key in movie) {
      (movie as any)[key] = value;
    }
  });

  if (movie.movieHref) {
    const movieHrefTitle = movie.movieHref.split(`${MULTIKINO_BASE_URL}/`)[1];
    movie.movieHref = `${MULTIKINO_BASE_URL}/repertuar/${city}/${movieHrefTitle}`;
    movie.screeningsHref = movie.movieHref;
  }

  return movie;
};

/**
 * @description
 * Function for getting all movies details from main repertoire page. It is also requesting movie details page for each movie for more details, such as director, duration, main cast, etc.
 *
 * @param document - Document object containing the HTML of the main repertoire page.
 *
 * @returns Promise<Movie[]> - A promise that resolves to an array of Movie objects representing the movies.
 */
const getMultikinoMoviesWithScreenings = async (
  document: Document,
  city: string
): Promise<{ movie: Movie; screenings: Screening[] }[]> => {
  const movieCards = document.querySelectorAll(MK_MOVIES_LIST_CARDS_SELECTOR);

  const movieCardsArray = Array.from(movieCards).slice(0, 1);

  // Getting all movies from main repertoire page.
  const movieDetailsHrefs = await Promise.all(
    movieCardsArray.map((card) =>
      populateMultikinoMovieBasicDetails(card, city)
    )
  );

  // Getting all movies details from movie details page.
  const moviesAndScreeningsDetails = await Promise.all(
    movieDetailsHrefs.map((movie) => populateMoviesAndScreeningsDetails(movie))
  );

  return moviesAndScreeningsDetails;
};

export default getMultikinoMoviesWithScreenings;
