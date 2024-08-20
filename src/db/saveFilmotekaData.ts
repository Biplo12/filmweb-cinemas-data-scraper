import { extractMoviesDataFromDocumentFilmoteka } from "../lib/filmoteka/moviesUtilaFilmoteka";

const saveFilmotekaData = async (city: string) => {
  const movies = await extractMoviesDataFromDocumentFilmoteka();
};

export default saveFilmotekaData;
