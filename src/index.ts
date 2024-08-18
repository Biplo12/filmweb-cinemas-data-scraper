import dotenv from "dotenv";
import { extractMovieDataFromDocument } from "./lib/moviesAndCinemasUtils";
import { connectDatabase } from "./prisma/prisma";
import { createMovie } from "./actions/createMovie";
import { createCinema } from "./actions/createCinema";
import { extractScreeningsDataFromDocument } from "./lib/screeningsUtils";
import { createScreening } from "./actions/createScreening";

dotenv.config();

const CITY = "Bytom";

const main = async () => {
  try {
    await connectDatabase();
    const { movies, cinemas } = await extractMovieDataFromDocument(CITY);
    const screenings = await extractScreeningsDataFromDocument(cinemas[0]);

    // for (const movie of movies) {
    //   await createMovie(movie);
    // }
    // for (const cinema of cinemas) {
    //   await createCinema(cinema);
    // }
    // for (const cinema of cinemas) {
    //   const screenings = await extractScreeningsDataFromDocument(cinema);
    //   for (const screening of screenings) {
    //     await createScreening(screening);
    //   }
    // }
  } catch (error) {
    console.error("Error processing data:", error);
  }
};

main();
