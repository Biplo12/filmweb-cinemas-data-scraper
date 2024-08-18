import {
  convertElementsToArray,
  durationStringToNumber,
  extractTextContentFromSelector,
  fetchPageHtml,
} from "./utils";
import { Cinema, MovieWithCastAndGenres, Selector } from "../interfaces";
import { FILMWEB_BASE_URL } from "../constants";

const MOVIE_CARD_SELECTOR =
  "div.showtimesFilmsItem__filmPreview.previewHolder.isSmall.smMicro.isBold.showGenresInHeader.showDuration.noPadding.noYear.variantPlot.variantAdditionalInfo";

const CINEMA_CARD_SELECTOR = "li.showtimesCinemasList__group";

const MOVIE_SELECTORS: Selector[] = [
  { key: "title", selector: "a.preview__link" },
  { key: "year", selector: "div.preview__year" },
  { key: "duration", selector: "div.preview__duration" },
  { key: "imagePoster", selector: "img.poster__image", attribute: "src" },
  { key: "director", selector: "div.preview__detail--director h3 a span" },
  { key: "description", selector: "div.preview__plotText" },
  { key: "production", selector: "div.preview__detail--country" },
  { key: "screeningsHref", selector: "a.preview__link", attribute: "href" },
];

const CINEMA_SELECTORS: Selector[] = [
  { key: "name", selector: "h3.showtimesCinemasList__itemHeader" },
  {
    key: "city",
    selector: "h3.showtimesCinemasList__groupHeader",
  },
  {
    key: "screeningsHref",
    selector: "a.showtimesCinemasList__link",
    attribute: "href",
  },
  {
    key: "latitude",
    selector: "li.showtimesCinemasList__item",
    attribute: "data-cinema-longitude",
  },
  {
    key: "longitude",
    selector: "li.showtimesCinemasList__item",
    attribute: "data-cinema-longitude",
  },
];

const createEmptyMovie = (): MovieWithCastAndGenres => ({
  title: "",
  year: 0,
  duration: 0,
  durationInMinutes: 0,
  imagePoster: "",
  director: "",
  movieHref: "",
  description: "",
  production: "",
  screeningsHref: "",
  mainCast: [],
  genres: [],
});

const createEmptyCinema = (): Cinema => ({
  name: "",
  city: "",
  screeningsHref: "",
  latitude: 0,
  longitude: 0,
});

const populateMovieData = (
  card: Element,
  city: string
): MovieWithCastAndGenres => {
  const movie = createEmptyMovie();

  MOVIE_SELECTORS.forEach(({ key, selector, attribute }) => {
    const value = extractTextContentFromSelector(selector, card, attribute);
    if (key in movie) {
      (movie as any)[key] = value;
    }
  });

  movie.mainCast = convertElementsToArray(
    card.querySelectorAll("div.preview__detail--cast h3")
  );

  if (movie.screeningsHref !== "N/A") {
    movie.screeningsHref = `${FILMWEB_BASE_URL}${movie.screeningsHref}/showtimes/${city}`;
    movie.movieHref = movie.screeningsHref.split("/showtimes")[0];
  }

  movie.genres = convertElementsToArray(
    card.querySelectorAll("div.preview__genresInHeader h3")
  );

  if (movie.duration) {
    movie.durationInMinutes = durationStringToNumber(movie.duration.toString());
  }

  return movie;
};

const populateCinemaData = (card: Element): Cinema => {
  const cinema = createEmptyCinema();

  CINEMA_SELECTORS.forEach(({ key, selector, attribute }) => {
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

export const extractMovieDataFromDocument = async (
  city: string
): Promise<{ movies: MovieWithCastAndGenres[]; cinemas: Cinema[] }> => {
  const document = await fetchPageHtml(`${FILMWEB_BASE_URL}/showtimes/${city}`);

  const movieCards = document.querySelectorAll(MOVIE_CARD_SELECTOR);
  const cinemasCards = document.querySelectorAll(CINEMA_CARD_SELECTOR);

  const movies = Array.from(movieCards).map((card) =>
    populateMovieData(card, city)
  );

  const cinemas = Array.from(cinemasCards).map((card) =>
    populateCinemaData(card)
  );

  const formattedCinemas = cinemas.map((cinema) => ({
    ...cinema,
    latitude: parseFloat(cinema.latitude.toString()),
    longitude: parseFloat(cinema.longitude.toString()),
  })) as Cinema[];

  const formattedMovies = movies.map((movie) => ({
    ...movie,
    year: parseInt(movie.year.toString()),
    duration: parseInt(movie.duration.toString()),
    durationInMinutes: parseInt(movie.durationInMinutes.toString()),
  })) as MovieWithCastAndGenres[];

  return { movies: formattedMovies, cinemas: formattedCinemas };
};
