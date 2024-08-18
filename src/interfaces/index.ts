export interface MovieWithCastAndGenres {
  title: string;
  year: number;
  duration: number;
  durationInMinutes: number;
  imagePoster: string;
  director: string;
  movieHref: string;
  description: string;
  production: string;
  mainCast: string[];
  genres: string[];
  screeningsHref?: string;
}

export interface Selector {
  key: string;
  selector: string;
  attribute?: string;
}

export interface Cinema {
  name: string;
  city: string;
  screeningsHref: string;
  latitude: number;
  longitude: number;
}

export interface Screening {
  date: string;
  time: string;
  href: string;
}

export interface ScreeningMovie {
  title: string;
  year: number;
  director: string;
}
