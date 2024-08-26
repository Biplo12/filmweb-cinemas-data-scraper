import { createCinema } from "../actions/createCinema";
import { createMovie } from "../actions/createMovie";
import getFilmwebScreenings from "../lib/filmweb/getFIlmwebScreenings";
import { createScreening } from "../actions/createScreening";
import { fetchPageHtmlRequest } from "../lib/utils";
import { FILMWEB_BASE_URL } from "../constants";
import getFilmwebMovies from "../lib/filmweb/getFilmwebMovies";
import getFilmwebCinemas from "../lib/filmweb/getFilmwebCinemas";

const saveFilmwebData = async (city: string): Promise<void> => {
  try {
    const FILMWEB_CITY_CINEMAS_URL = `${FILMWEB_BASE_URL}/showtimes/${city}`;
    const document = await fetchPageHtmlRequest(FILMWEB_CITY_CINEMAS_URL);

    console.log(
      `Starting to fetch movies and cinemas for ${city}. URL: ${FILMWEB_CITY_CINEMAS_URL}`
    );

    const movies = await getFilmwebMovies(city, document);
    const cinemas = await getFilmwebCinemas(document);

    await Promise.all(
      movies.map(async (movie) => {
        await createMovie(movie);
      })
    );

    await Promise.all(
      cinemas.map(async (cinema) => {
        await createCinema(cinema);
      })
    );

    await Promise.all(
      cinemas.map(async (cinema) => {
        console.log(`Starting to fetch screenings for ${cinema.name}.`);
        const screenings = await getFilmwebScreenings(cinema);

        return Promise.all(
          screenings.map(async (screening) => {
            await createScreening(screening);
          })
        );
      })
    );

    console.log("All cinemas processed successfully.");
  } catch (error) {
    console.error("Error processing data:", error);
  }
};

export default saveFilmwebData;
