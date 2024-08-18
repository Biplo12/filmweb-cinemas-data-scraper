import dotenv from "dotenv";
import { extractMovieDataFromDocument } from "./lib/moviesAndCinemasUtils";
import { connectDatabase } from "./prisma/prisma";
import { createMovie } from "./actions/createMovie";
import { createCinema } from "./actions/createCinema";
import { extractScreeningsDataFromDocument } from "./lib/screeningsUtils";

dotenv.config();

const CITY = "Bytom";

const main = async () => {
  try {
    await connectDatabase();
    const { movies, cinemas } = await extractMovieDataFromDocument(CITY);
    const screenings = await extractScreeningsDataFromDocument(
      cinemas[0].screeningsHref
    );

    await createMovie(movies[0]);
    await createCinema(cinemas[0]);
  } catch (error) {
    console.error("Error processing data:", error);
  }
};

main();
