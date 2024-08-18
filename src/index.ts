import dotenv from "dotenv";
import { extractMoviesAndCinemasDataFromDocumentFilmweb } from "./lib/moviesAndCinemasUtilsFilmweb";
import { connectDatabase } from "./prisma/prisma";
import { createMovie } from "./actions/createMovie";
import { createCinema } from "./actions/createCinema";
import { extractScreeningsDataFromDocumentFilmweb } from "./lib/screeningsUtilsFilmweb";
import { createScreening } from "./actions/createScreening";

dotenv.config();

const CITY = "Bytom";

const main = async () => {
  try {
    await connectDatabase();
    const { movies, cinemas } =
      await extractMoviesAndCinemasDataFromDocumentFilmweb(CITY);

    for (const movie of movies) {
      await createMovie(movie);
    }

    for (const cinema of cinemas) {
      await createCinema(cinema);
    }

    for (const cinema of cinemas) {
      const screenings = await extractScreeningsDataFromDocumentFilmweb(cinema);

      for (const screening of screenings) {
        await createScreening(screening);
      }
    }

    console.log(
      `Data processed successfully - added ${movies.length} movies, ${cinemas.length} cinemas.`
    );
  } catch (error) {
    console.error("Error processing data:", error);
  }
};

main();
