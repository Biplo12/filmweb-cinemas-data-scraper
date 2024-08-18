import {
  convertElementsToArray,
  durationStringToNumber,
  extractTextContentFromSelector,
  fetchPageHtml,
} from "./utils";
import { Cinema, CinemaGroup, Movie, Selector } from "../interfaces";
import { FILMWEB_BASE_URL } from "../constants";

const MOVIE_CARD_SELECTOR =
  "div.showtimesFilmsItem__filmPreview.previewHolder.isSmall.smMicro.isBold.showGenresInHeader.showDuration.noPadding.noYear.variantPlot.variantAdditionalInfo";

const CINEMA_CARD_SELECTOR = "li.showtimesCinemasList__item";

const CINEMA_GROUP_SELECTOR = "li.showtimesCinemasList__group";

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

const CINEMA_GROUP_SELECTORS: Selector[] = [
  { key: "city", selector: "h3.showtimesCinemasList__groupHeader" },
  {
    key: "latitude",
    selector: "li.showtimesCinemasList__item",
    attribute: "data-cinema-latitude",
  },
  {
    key: "longitude",
    selector: "li.showtimesCinemasList__item",
    attribute: "data-cinema-longitude",
  },
];

const CINEMA_SELECTORS: Selector[] = [
  { key: "name", selector: "h3.showtimesCinemasList__itemHeader" },
  {
    key: "screeningsHref",
    selector: "a.showtimesCinemasList__link",
    attribute: "href",
  },
];

const createEmptyMovie = (): Movie => ({
  title: "",
  year: 0,
  duration: 0,
  durationInMinutes: 0,
  imagePoster: "",
  director: "",
  movieHref: "",
  description: "",
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

const createEmptyCinemaGroup = (): CinemaGroup => ({
  cinemas: [],
  city: "",
  latitude: 0,
  longitude: 0,
});

const populateMovieData = (card: Element, city: string): Movie => {
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

const populateCinemaGroupData = (card: Element): CinemaGroup => {
  const cinemaGroup = createEmptyCinemaGroup();

  CINEMA_GROUP_SELECTORS.forEach(({ key, selector, attribute }) => {
    const value = extractTextContentFromSelector(selector, card, attribute);
    if (key in cinemaGroup) {
      (cinemaGroup as any)[key] = value;
    }
  });

  cinemaGroup.cinemas = Array.from(
    card.querySelectorAll(CINEMA_CARD_SELECTOR)
  ).map((card) => populateCinemaData(card));

  cinemaGroup.cinemas.forEach((cinema) => {
    cinema.city = cinemaGroup.city;
    cinema.latitude = parseFloat(cinemaGroup.latitude.toString());
    cinema.longitude = parseFloat(cinemaGroup.longitude.toString());
  });

  console.log(cinemaGroup);

  return cinemaGroup;
};

export const extractMoviesAndCinemasDataFromDocumentFilmweb = async (
  city: string
): Promise<{ movies: Movie[]; cinemas: Cinema[] }> => {
  const document = await fetchPageHtml(`${FILMWEB_BASE_URL}/showtimes/${city}`);

  const movieCards = document.querySelectorAll(MOVIE_CARD_SELECTOR);
  const cinemaGroupCards = document.querySelectorAll(CINEMA_GROUP_SELECTOR);

  const movies = Array.from(movieCards).map((card) =>
    populateMovieData(card, city)
  );

  const cinemasGroups = Array.from(cinemaGroupCards).map((card) =>
    populateCinemaGroupData(card)
  );

  const cinemas = cinemasGroups.flatMap((group) => group.cinemas);

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
  })) as Movie[];

  return { movies: formattedMovies, cinemas: formattedCinemas };
};
