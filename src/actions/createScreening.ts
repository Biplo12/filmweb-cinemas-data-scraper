import { prisma } from "../prisma/prisma";
import { Screening } from "../interfaces";
import { createMovie } from "./createMovie";
import { createCinema } from "./createCinema";

export const createScreening = async (screening: Screening) => {
  try {
    if (!screening.cinema.name || !screening.cinema.city) {
      console.log("Cinema data is missing");
      return;
    }

    const isScreeningExist = await prisma.screening.findFirst({
      where: {
        date: screening.screening.date || "N/A",
        bookingHref: screening.screening.bookingHref,
        cinema: {
          is: {
            name: { equals: screening.cinema.name, mode: "insensitive" },
            city: { equals: screening.cinema.city, mode: "insensitive" },
            latitude: screening.cinema.latitude,
            longitude: screening.cinema.longitude,
          },
        },
        movie: {
          is: {
            title: { equals: screening.movie.title, mode: "insensitive" },
            director: { equals: screening.movie.director, mode: "insensitive" },
            year: screening.movie.year,
          },
        },
      },
    });

    if (isScreeningExist) {
      console.log(
        `Screening already exists: ${screening.movie.title} (${screening.cinema.name})`
      );

      return isScreeningExist;
    }

    let movie = await prisma.movie.findFirst({
      where: {
        title: { equals: screening.movie.title, mode: "insensitive" },
        director: { equals: screening.movie.director, mode: "insensitive" },
        year: screening.movie.year,
      },
    });

    let cinema = await prisma.cinema.findFirst({
      where: {
        name: { equals: screening.cinema.name, mode: "insensitive" },
        city: { equals: screening.cinema.city, mode: "insensitive" },
        latitude: screening.cinema.latitude,
        longitude: screening.cinema.longitude,
      },
    });

    if (!movie) {
      const createdMovie = await createMovie(screening.movie);

      if (createdMovie) {
        movie = createdMovie;
      }
    }

    if (!cinema) {
      const createdCinema = await createCinema(screening.cinema);

      if (createdCinema) {
        cinema = createdCinema;
      }
    }

    const createdScreening = await prisma.screening.create({
      data: {
        date: screening.screening.date || "N/A",
        bookingHref: screening.screening.bookingHref,
        cinema: {
          connect: {
            id: cinema?.id,
          },
        },
        movie: {
          connect: {
            id: movie?.id,
          },
        },
      },
    });

    return createdScreening;
  } catch (err) {
    console.log(err);
  }
};
