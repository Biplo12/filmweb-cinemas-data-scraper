import { FILMWEB_BASE_URL } from "../constants";
import { Cinema, Screening, ScreeningMovie, Selector } from "../interfaces";
import { extractTextContentFromSelector, fetchPageHtml } from "./utils";

const MOVIE_CARD_SELECTOR =
  "div.showtimesFilmsItem__filmPreview.previewHolder.isSmall.smMicro.isBold.showGenresInHeader.showDuration.noPadding.noYear.variantPlot.variantAdditionalInfo";

const MOVIE_SELECTORS: Selector[] = [
  { key: "title", selector: "a.preview__link" },
  { key: "year", selector: "div.preview__year" },
  { key: "director", selector: "div.preview__detail--director h3 a span" },
];

const SCREENING_SELECTORS: Selector[] = [
  { key: "date", selector: "div.preview__date" },
  { key: "time", selector: "div.preview__time" },
  { key: "href", selector: "a.preview__link" },
];

const createEmptyMovie = (): ScreeningMovie => ({
  title: "",
  year: 0,
  director: "",
});

const createEmptyScreening = (): Screening => ({
  date: "",
  time: "",
  href: "",
});

const populateMovieData = (card: Element): Screening => {
  const screening = createEmptyScreening();

  MOVIE_SELECTORS.forEach(({ key, selector, attribute }) => {
    const value = extractTextContentFromSelector(selector, card, attribute);
    if (key in screening) {
      (screening as any)[key] = value;
    }
  });

  return screening;
};

export const extractScreeningsDataFromDocument = async (
  screeningsHref: string | undefined
): Promise<void> => {
  if (!screeningsHref) {
    throw new Error("Screenings href is undefined");
  }

  const document = await fetchPageHtml(screeningsHref);
  const moviesCards = document.querySelectorAll(MOVIE_CARD_SELECTOR);

  const movies = Array.from(moviesCards).map((card) => populateMovieData(card));

  console.log(movies);
};
