import { FILMWEB_BASE_URL } from "../../constants";
import { Cinema, Screening, Selector } from "../../interfaces";
import {
  convertDateStringToDateObject,
  convertElementsToArray,
  createEmptyScreening,
  durationStringToNumber,
  extractTextContentFromSelector,
  fetchPageHtml,
} from "../utils";

const MOVIE_CARD_SELECTOR =
  "div.showtimesFilmsListSection__film.ShowtimesFilmsItem.showtimesFilmsItem";

const SCREENING_SELECTORS: Selector[] = [
  { key: "movie.title", selector: "a.preview__link" },
  { key: "movie.year", selector: "div.preview__year" },
  { key: "movie.duration", selector: "div.preview__duration" },
  { key: "movie.imagePoster", selector: "img.poster__image", attribute: "src" },
  {
    key: "movie.director",
    selector: "div.preview__detail--director h3 a span",
  },
  { key: "movie.description", selector: "div.preview__plotText" },
  { key: "movie.production", selector: "div.preview__detail--country h3 span" },
  { key: "movie.mainCast", selector: "div.preview__detail--cast h3 a span" },
  { key: "movie.genres", selector: "div.preview__detail--genre a span" },
  { key: "movie.href", selector: "a.preview__link", attribute: "href" },
  {
    key: "screening.date",
    selector: "div.seanceTile.SeanceTile",
    attribute: "data-date",
  },
  {
    key: "screening.time",
    selector: "div.seanceTile.SeanceTile",
    attribute: "data-value",
  },
  {
    key: "screening.bookingHref",
    selector: "a.seanceTile__link",
    attribute: "href",
  },
];

const populateScreeningData = (card: Element): Screening => {
  const screening = createEmptyScreening();

  SCREENING_SELECTORS.forEach(({ key, selector, attribute }) => {
    const value = extractTextContentFromSelector(selector, card, attribute);
    const keys = key.split(".");
    if (keys.length === 2 && keys[0] in screening) {
      (screening as any)[keys[0]][keys[1]] = value;
    }
  });

  if (
    !screening.screening.bookingHref.includes(FILMWEB_BASE_URL) &&
    screening.screening.bookingHref !== "N/A"
  ) {
    screening.screening.bookingHref = `${FILMWEB_BASE_URL}${screening.screening.bookingHref}`;
  }

  screening.movie.mainCast = convertElementsToArray(
    card.querySelectorAll("div.preview__detail--cast h3")
  );

  screening.movie.genres = convertElementsToArray(
    card.querySelectorAll("div.preview__genresInHeader h3")
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

  return screening;
};

export const extractScreeningsDataFromDocumentFilmweb = async (
  cinema: Cinema
): Promise<Screening[]> => {
  if (!cinema) {
    throw new Error("Cinema is undefined");
  }

  const document = await fetchPageHtml(cinema.screeningsHref);
  const moviesCards = document.querySelectorAll(MOVIE_CARD_SELECTOR);

  const screenings = Array.from(moviesCards).map((card) =>
    populateScreeningData(card)
  );

  const filteredScreenings = screenings.filter(
    (screening) =>
      screening.screening.date !== "N/A" &&
      screening.screening.date !== undefined
  );

  const formattedScreenings = filteredScreenings.map((screening) => ({
    ...screening,
    movie: {
      ...screening.movie,
      year: parseInt(screening.movie.year.toString()),
    },
    screening: {
      ...screening.screening,
      date: convertDateStringToDateObject(
        screening.screening.date?.toString(),
        screening.screening.time
      ),
    },
    cinema: {
      ...screening.cinema,
      name: cinema.name,
      city: cinema.city,
      latitude: cinema.latitude,
      longitude: cinema.longitude,
      screeningsHref: cinema.screeningsHref,
    },
  }));

  return formattedScreenings;
};
