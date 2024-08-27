import { prisma } from "../prisma/prisma";
import { Screening } from "../interfaces";
import { createMovie } from "./createMovie";
import { createCinema } from "./createCinema";

export const createScreening = async (screening: Screening) => {
  try {
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
            durationInMinutes: screening.movie.durationInMinutes,
          },
        },
      },
    });

    if (isScreeningExist) {
      console.log(
        `Screening already exists: ${screening.movie.title} (${
          screening.cinema.name
        } [${
          screening.cinema.city
        }]) - ${screening.screening.date?.toLocaleString()}`
      );

      return isScreeningExist;
    }

    const movie = await createMovie(screening.movie);
    const cinema = await createCinema(screening.cinema);

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

    console.log(`Screening created: ${createdScreening.id}`);
    return createdScreening;
  } catch (err) {
    console.log(err);
  }
};
