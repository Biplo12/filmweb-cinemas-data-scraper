import { prisma } from "../prisma/prisma";
import { MovieWithCastAndGenres } from "../interfaces";

export const createMovie = async (movie: MovieWithCastAndGenres) => {
  try {
    const isMovieExist = await prisma.movie.findFirst({
      where: {
        title: movie.title,
        year: movie.year,
      },
    });

    if (isMovieExist) {
      console.log(`Movie ${movie.title} already exists`);
      return;
    }

    await prisma.movie.create({
      data: {
        ...movie,
        screeningsHref: movie.screeningsHref || "N/A",
        mainCast: {
          create: movie.mainCast.map((cast) => ({ name: cast })),
        },
        genres: {
          create: movie.genres.map((genre) => ({ name: genre })),
        },
      },
    });

    console.log(`Movie ${movie.title} created successfully`);
  } catch (err) {
    console.log(err);
  }
};
