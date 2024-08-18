import { prisma } from "../prisma/prisma";
import { Movie } from "../interfaces";

export const createMovie = async (movie: Movie) => {
  try {
    const isMovieExist = await prisma.movie.findFirst({
      where: {
        title: movie.title,
        year: movie.year,
      },
    });

    if (isMovieExist) {
      console.log(`Movie ${movie.title} already exists`);
      return isMovieExist;
    }

    const createdMovie = await prisma.movie.create({
      data: {
        ...movie,
        screeningsHref: movie.screeningsHref || "N/A",
        mainCast: {
          create: movie.mainCast.map((cast: string) => ({ name: cast })),
        },
        genres: {
          create: movie.genres.map((genre: string) => ({ name: genre })),
        },
      },
    });

    console.log(`Movie ${movie.title} created successfully`);
    return createdMovie;
  } catch (err) {
    console.log(err);
  }
};
