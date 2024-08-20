import { extractMoviesScreeningsDataFromDocumentMultikino } from "../lib/multikino/moviesScreeningsUtilsMultikino";

const saveMultikinoData = async (city: string) => {
  const movies = await extractMoviesScreeningsDataFromDocumentMultikino(city);
};

export default saveMultikinoData;
