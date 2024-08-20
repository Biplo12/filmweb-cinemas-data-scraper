import { createCinema } from "../actions/createCinema";
import { createMovie } from "../actions/createMovie";
import { createScreening } from "../actions/createScreening";
import { extractMoviesAndCinemasDataFromDocumentFilmweb } from "../lib/filmweb/moviesAndCinemasUtilsFilmweb";
import { extractScreeningsDataFromDocumentFilmweb } from "../lib/filmweb/screeningsUtilsFilmweb";
import saveMultikinoData from "./saveMultikinoData";

const saveFilmwebData = async (city: string) => {
  try {
    // const { movies: filmwebMovies, cinemas: filmwebCinemas } =
    //   await extractMoviesAndCinemasDataFromDocumentFilmweb(city);

    // for (const movie of filmwebMovies) {
    //   await createMovie(movie);
    // }

    // for (const cinema of filmwebCinemas) {
    //   await createCinema(cinema);
    // }

    // for (const cinema of filmwebCinemas) {
    //   const screenings = await extractScreeningsDataFromDocumentFilmweb(cinema);

    //   for (const screening of screenings) {
    //     await createScreening(screening);
    //   }
    // }
    // const multikinoCinema = filmwebCinemas.filter(
    //   (cinema) => cinema.name === "Multikino"
    // );

    await saveMultikinoData("Zabrze");

    // console.log(
    //   `Data processed successfully (Filmweb) - added ${filmwebMovies.length} movies, ${filmwebCinemas.length} cinemas.`
    // );
  } catch (error) {
    console.error("Error processing data:", error);
  }
};

export default saveFilmwebData;
