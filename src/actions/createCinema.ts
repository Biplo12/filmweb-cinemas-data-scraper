import { prisma } from "../prisma/prisma";
import { Cinema } from "../interfaces";

export const createCinema = async (cinema: Cinema) => {
  try {
    const isCinemaExist = await prisma.cinema.findFirst({
      where: {
        name: cinema.name,
        city: cinema.city,
        screeningsHref: cinema.screeningsHref,
        latitude: cinema.latitude,
        longitude: cinema.longitude,
      },
    });

    if (isCinemaExist) {
      return;
    }

    const createdCinema = await prisma.cinema.create({
      data: cinema,
    });

    return createdCinema;
  } catch (err) {
    console.log(err);
  }
};
