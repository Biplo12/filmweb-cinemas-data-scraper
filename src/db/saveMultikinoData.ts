import { MULTIKINO_BASE_URL } from "../constants";
import { Cinema } from "../interfaces";
import getMultikinoMoviesWithScreenings from "../lib/multikino/getMultikinoMoviesWithScreenings";
import { MK_MOVIES_LIST_CARDS_SELECTOR } from "../lib/multikino/selectors";
import { fetchPageHtml } from "../lib/utils";

const saveMultikinoData = async (multikinoCinema: Cinema | undefined) => {
  try {
    if (!multikinoCinema) return;

    const document = await fetchPageHtml(
      `${MULTIKINO_BASE_URL}/repertuar/${multikinoCinema.city}`,
      MK_MOVIES_LIST_CARDS_SELECTOR
    );

    const moviesAndScreenings = await getMultikinoMoviesWithScreenings(
      document,
      multikinoCinema.city
    );

    moviesAndScreenings.forEach(({ screenings }) => {
      screenings.forEach((screening) => {
        screening.cinema = multikinoCinema;
      });
    });
  } catch (error) {
    console.error("Error processing data:", error);
  }
};

export default saveMultikinoData;
