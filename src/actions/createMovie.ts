import { prisma } from "../prisma/prisma";
import { Movie } from "../interfaces";

export const createMovie = async (movie: Movie) => {
  try {
    const isMovieExist = await prisma.movie.findFirst({
      where: {
        title: {
          equals: movie.title,
          mode: "insensitive",
        },
        year: movie.year,
      },
    });
    if (isMovieExist) {
      return isMovieExist;
    }
    const createdMovie = await prisma.movie.create({
      data: {
        ...movie,
        screeningsHref: movie.screeningsHref || "N/A",
        duration: Number(movie.duration), // Convert duration to number
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
