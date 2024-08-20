import { MULTIKINO_BASE_URL } from "../../constants";
import { Movie, Selector } from "../../interfaces";
import {
  convertElementsToArray,
  durationNumberToDurationString,
  extractTextContentFromSelector,
  fetchPageHtml,
} from "../utils";

const MOVIE_CARDS_SELECTOR = "div.filmlist__item";

const MOVIE_CARD_SELECTOR: Selector = {
  key: "movieHref",
  selector: "a.filmlist__title.subtitle.h3",
  attribute: "href",
};

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
  duration: "",
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

  movie.movieHref = extractTextContentFromSelector(
    MOVIE_CARD_SELECTOR.selector,
    card,
    MOVIE_CARD_SELECTOR.attribute
  );

  movie.movieHref = `${MULTIKINO_BASE_URL}${movie.movieHref}`;

  return movie;
};

const populateMoviesDetails = async (movie: Movie): Promise<Movie> => {
  const movieDetails = await fetchPageHtml(movie.movieHref);

  MOVIE_DETAILS_SELECTORS.forEach(({ key, selector, attribute }) => {
    const value = extractTextContentFromSelector(
      selector,
      movieDetails,
      attribute
    );
    if (key in movie) {
      (movie as any)[key] = value;
    }
  });

  if (movie.imagePoster !== "N/A") {
    movie.imagePoster = `${MULTIKINO_BASE_URL}${movie.imagePoster}`;
  }

  const splitYear = movie.year.toString().split(" ");
  movie.year = Number(splitYear[splitYear.length - 1]);

  const splitDurationMinutes = movie.duration.toString().split(" ");

  movie.durationInMinutes = Number(splitDurationMinutes[0]);
  movie.duration = durationNumberToDurationString(movie.durationInMinutes);

  movie.mainCast = convertElementsToArray(
    movieDetails.querySelectorAll("dl.info__cast dd")
  );

  movie.genres = convertElementsToArray(
    movieDetails.querySelectorAll("p.film-details a.film-details__item")
  );

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

  const moviesWithDetails = await Promise.all(
    movies.map((movie) => populateMoviesDetails(movie))
  );

  console.log(moviesWithDetails);

  return moviesWithDetails;
};
