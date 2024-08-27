import { createCinema } from "../actions/createCinema";
import { createScreening } from "../actions/createScreening";
import { fetchPageHtmlRequest } from "../lib/utils";
import { FILMWEB_BASE_URL } from "../constants";
import getFilmwebCinemas from "../lib/filmweb/getFilmwebCinemas";
import getFIlmwebMoviesWithScreenings from "../lib/filmweb/getFIlmwebMoviesWithScreenings";

const saveFilmwebData = async (city: string): Promise<void> => {
  try {
    const FILMWEB_CITY_CINEMAS_URL = `${FILMWEB_BASE_URL}/showtimes/${city}`;
    const document = await fetchPageHtmlRequest(FILMWEB_CITY_CINEMAS_URL);

    const cinemas = await getFilmwebCinemas(document);

    for (const cinema of cinemas) {
      await createCinema(cinema);
    }

    for (const cinema of cinemas) {
      const screenings = await getFIlmwebMoviesWithScreenings(cinema);
      for (const screening of screenings) {
        await createScreening(screening);
      }
    }

    console.log("Data saved successfully");
  } catch (error) {
    console.error("Error processing data:", error);
  }
};

export default saveFilmwebData;
