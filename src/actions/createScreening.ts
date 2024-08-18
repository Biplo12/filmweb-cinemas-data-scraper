import { prisma } from "../prisma/prisma";
import { Screening } from "../interfaces";
import { createMovie } from "./createMovie";
import { createCinema } from "./createCinema";
import { Movie, Cinema } from "@prisma/client";

export const createScreening = async (screening: Screening) => {
  try {
    if (!screening.cinema.name || !screening.cinema.city) {
      console.log("Cinema data is missing");
      return;
    }

    const isScreeningExist = await prisma.screening.findFirst({
      where: {
        date: screening.screening.date || "N/A",
        time: screening.screening.time,
        bookingHref: screening.screening.bookingHref,
        cinema: {
          is: {
            name: screening.cinema.name,
            city: screening.cinema.city,
            latitude: screening.cinema.latitude,
            longitude: screening.cinema.longitude,
          },
        },
      },
    });

    if (isScreeningExist) {
      console.log(
        `Screening for ${screening.screening.date} at ${screening.screening.time} in ${screening.cinema.name} already exists`
      );
      return;
    }

    let movie = await prisma.movie.findFirst({
      where: {
        title: screening.movie.title,
        year: screening.movie.year,
        director: screening.movie.director,
      },
    });

    let cinema = await prisma.cinema.findFirst({
      where: {
        name: screening.cinema.name,
        city: screening.cinema.city,
        latitude: screening.cinema.latitude,
        longitude: screening.cinema.longitude,
      },
    });

    if (!movie) {
      movie = (await createMovie({
        title: screening.movie.title,
        year: screening.movie.year,
        duration: screening.movie.duration,
        durationInMinutes: screening.movie.durationInMinutes,
        imagePoster: screening.movie.imagePoster,
        director: screening.movie.director,
        movieHref: screening.movie.movieHref,
        description: screening.movie.description,
        mainCast: screening.movie.mainCast,
        genres: screening.movie.genres,
      })) as Movie;
    }

    if (!cinema) {
      cinema = (await createCinema({
        name: screening.cinema.name,
        city: screening.cinema.city,
        latitude: screening.cinema.latitude,
        longitude: screening.cinema.longitude,
        screeningsHref: screening.cinema.screeningsHref || "N/A",
      })) as Cinema;
    }

    await prisma.screening.create({
      data: {
        date: screening.screening.date || "N/A",
        time: screening.screening.time,
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

    console.log(
      `Screening for ${screening.screening.date} at ${screening.screening.time} in ${screening.cinema.name} created successfully`
    );
  } catch (err) {
    console.log(err);
  }
};
