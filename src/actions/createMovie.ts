import { prisma } from "../prisma/prisma";
import { Movie } from "../interfaces";

interface MovieWithoutDuration extends Omit<Movie, "duration"> {}

export const createMovie = async (movie: MovieWithoutDuration) => {
  try {
    const isMovieExist = await prisma.movie.findFirst({
      where: {
        title: { equals: movie.title, mode: "insensitive" },
        director: { equals: movie.director, mode: "insensitive" },
        year: movie.year,
      },
    });

    if (isMovieExist) {
      console.log(`Movie already exists: ${movie.title} (${movie.year})`);

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

    return createdMovie;
  } catch (err) {
    console.log(err);
  }
};
