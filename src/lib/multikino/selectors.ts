import { Selector } from "../../interfaces";

// Main wrapper selectors.
export const MK_MOVIES_LIST_CARDS_SELECTOR = "li.showing-listing__item";
export const MK_MOVIES_SCREENINGS_CONTAINER_SELECTOR =
  "div.sessions__block.sessions__block_fdp";
export const MK_SCREENINGS_LIST_SELECTOR =
  "div.sessions__block.sessions__block_fdp li.sessions__group-list__item";
export const MK_SCREENINGS_ITEM_SELECTOR = "li.sessions__list__item";

// Movie details selectors.
export const MK_MOVIE_DETAILS_INFO_LIST_SELECTOR =
  "ul.film-details__info-list li dl dd";

export const MK_MOVIES_LIST_CARD_SELECTOR: Selector[] = [
  { key: "title", selector: "span.film-heading__title" },
  {
    key: "movieHref",
    selector: "a.film-heading",
    attribute: "href",
  },
];

export const MK_MOVIE_DETAILS_SELECTORS: Selector[] = [
  { key: "year", selector: "ul.film-details__info-list li dl dd" },
  { key: "duration", selector: "dl.info__runningtime dd" },
  { key: "director", selector: "dl.info__director dd" },
  { key: "description", selector: "div.film-description__text p" },
  {
    key: "imagePoster",
    selector: "div.aspect-ratio__container img",
    attribute: "src",
  },
];

export const MK_SCREENING_DATE_SELECTOR = {
  key: "date",
  selector: "div.sessions__group-date.sessions__group-date_fdp time",
  attribute: "datetime",
};

export const MK_SCREENINGS_SELECTORS: Selector[] = [
  { key: "time", selector: "time.session__time__start" },
  { key: "bookingHref", selector: "a.session", attribute: "href" },
];
