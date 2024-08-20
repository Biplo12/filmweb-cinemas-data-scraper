import { extractMoviesScreeningsDataFromDocumentMultikino } from "../lib/multikino/moviesScreeningsUtilsMultikino";

const saveMultikinoData = async (city: string) => {
  try {
    const movies = await extractMoviesScreeningsDataFromDocumentMultikino(city);
  } catch (error) {
    console.error("Error processing data:", error);
  }
};

export default saveMultikinoData;
