import { createCinema } from "../actions/createCinema";
import { createMovie } from "../actions/createMovie";
import { createScreening } from "../actions/createScreening";
import getFilmwebMoviesAndCinemas from "../lib/filmweb/getFilmwebMoviesAndCinemas";
import getFilmwebScreenings from "../lib/filmweb/getFIlmwebScreenings";
// import saveMultikinoData from "./saveMultikinoData";

const saveFilmwebData = async (city: string) => {
  try {
    const { movies: filmwebMovies, cinemas: filmwebCinemas } =
      await getFilmwebMoviesAndCinemas(city);

    await Promise.all(
      filmwebMovies.map(async (movie) => {
        await createMovie(movie);
      })
    );

    await Promise.all(
      filmwebCinemas.map(async (cinema) => {
        await createCinema(cinema);
      })
    );

    await Promise.all(
      filmwebCinemas.map(async (cinema) => {
        const screenings = await getFilmwebScreenings(cinema);

        return Promise.all(
          screenings.map(async (screening) => {
            await createScreening(screening);
          })
        );
      })
    );

    // const multikinoCinemas = filmwebCinemas.filter(
    //   (cinema) => cinema.name === "Multikino"
    // );

    // await Promise.all(
    //   multikinoCinemas.map(async (cinema) => {
    //     await saveMultikinoData(cinema);
    //   })
    // );
  } catch (error) {
    console.error("Error processing data:", error);
  }
};

export default saveFilmwebData;
