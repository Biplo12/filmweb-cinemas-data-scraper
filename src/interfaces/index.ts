export interface Selector {
  key: string;
  selector: string;
  attribute?: string;
  attributeToFind?: string;
}

export interface Cinema {
  name: string;
  city: string;
  screeningsHref: string;
  latitude: number;
  longitude: number;
}

export interface Movie {
  title: string;
  year: number;
  duration: string | undefined;
  durationInMinutes: number;
  imagePoster: string;
  director: string;
  description: string;
  mainCast: string[];
  genres: string[];
  movieHref: string;
  screeningsHref?: string;
}

export interface ScreeningDetails {
  date?: Date | string;
  time: string;
  bookingHref: string;
}

export interface Cinema {
  name: string;
  city: string;
  screeningsHref: string;
  latitude: number;
  longitude: number;
}

export interface Screening {
  movie: Movie;
  screening: ScreeningDetails;
  cinema: Cinema;
}

export interface CinemaGroup {
  cinemas: Cinema[];
  city: string;
  latitude: number;
  longitude: number;
}
