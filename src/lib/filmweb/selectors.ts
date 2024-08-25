import { Selector } from "../../interfaces";

export const FW_MOVIE_CARD_SELECTOR =
  "div.showtimesFilmsItem__filmPreview.previewHolder.isSmall.smMicro.isBold.showGenresInHeader.showDuration.noPadding.noYear.variantPlot.variantAdditionalInfo";

export const FW_CINEMA_CARD_SELECTOR = "li.showtimesCinemasList__item";

export const FW_CINEMA_GROUP_SELECTOR = "li.showtimesCinemasList__group";

export const FW_MOVIE_SELECTORS: Selector[] = [
  { key: "title", selector: "a.preview__link" },
  { key: "year", selector: "div.preview__year" },
  { key: "duration", selector: "div.preview__duration" },
  { key: "imagePoster", selector: "img.poster__image", attribute: "src" },
  { key: "director", selector: "div.preview__detail--director h3 a span" },
  { key: "description", selector: "div.preview__plotText" },
  { key: "screeningsHref", selector: "a.preview__link", attribute: "href" },
];

export const FW_CINEMA_GROUP_SELECTORS: Selector[] = [
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

export const FW_CINEMA_SELECTORS: Selector[] = [
  { key: "name", selector: "h3.showtimesCinemasList__itemHeader" },
  {
    key: "screeningsHref",
    selector: "a.showtimesCinemasList__link",
    attribute: "href",
  },
];

export const FW_SCREENING_CARD_SELECTOR =
  "div.showtimesFilmsListSection__film.ShowtimesFilmsItem.showtimesFilmsItem";

export const FW_SCREENING_SELECTORS: Selector[] = [
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