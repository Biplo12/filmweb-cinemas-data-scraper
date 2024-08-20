import { MULTIKINO_BASE_URL } from "../../constants";
import { Movie, Selector } from "../../interfaces";
import {
  convertElementsToArray,
  durationStringToNumber,
  extractTextContentFromSelector,
  fetchPageHtml,
} from "../utils";

const MOVIE_CARDS_SELECTOR = "div.filmlist__item";

const MOVIE_CARDS_SELECTORS: Selector[] = [
  {
    key: "movieHref",
    selector: "a.filmlist__title.subtitle.h3",
    attribute: "href",
  },
];

const MOVIE_DETAILS_SELECTORS: Selector[] = [
  { key: "title", selector: "h2.h2.details__heading" },
  { key: "year", selector: "dl.info__releasedate dd" },
  { key: "duration", selector: "dl.info__runningtime dd" },
  { key: "director", selector: "dl.info__director dd" },
  { key: "description", selector: "div.details__synopsis p" },
  {
    key: "imagePoster",
    selector: "div.meta__poster img",
    attribute: "src",
  },
];

const createEmptyMovie = (): Movie => ({
  title: "",
  year: 0,
  duration: 0,
  durationInMinutes: 0,
  imagePoster: "",
  director: "",
  description: "",
  mainCast: [],
  genres: [],
  movieHref: "",
});

const populateMoviesData = async (card: Element): Promise<Movie> => {
  const movie = createEmptyMovie();

  MOVIE_CARDS_SELECTORS.forEach(({ key, selector, attribute }) => {
    const value = extractTextContentFromSelector(selector, card, attribute);
    if (key in movie) {
      (movie as any)[key] = value;
    }
  });

  movie.movieHref = `${MULTIKINO_BASE_URL}${movie.movieHref}`;
  return movie;
};

const populateMoviesDetails = async (movie: Movie): Promise<Movie> => {
  const movieDetails = await fetchPageHtml(movie.movieHref);

  MOVIE_DETAILS_SELECTORS.forEach(({ key, selector }) => {
    const value = extractTextContentFromSelector(selector, movieDetails);
    if (key in movie) {
      (movie as any)[key] = value;
    }
  });

  movie.imagePoster = `${MULTIKINO_BASE_URL}${movie.imagePoster}`;

  movie.durationInMinutes = durationStringToNumber(movie.duration.toString());
  // @ts-ignore
  const splitYear = movie.year.split(" ");
  movie.year = Number(splitYear[splitYear.length - 1]);

  return movie;
};

export const extractMoviesScreeningsDataFromDocumentMultikino = async (
  city: string
) => {
  const document = await fetchPageHtml(
    `${MULTIKINO_BASE_URL}/repertuar/${city}`,
    "div.whatsOnV2"
  );

  const movieCards = document.querySelectorAll(MOVIE_CARDS_SELECTOR);
  const movies = await Promise.all(
    Array.from(movieCards)
      .slice(0, 1)
      .map((card) => populateMoviesData(card))
  );
  console.log(movies);

  const moviesDetails = await Promise.all(
    movies.map((movie) => populateMoviesDetails(movie))
  );

  return moviesDetails;
};
