import { prisma } from "../prisma/prisma";
import { Cinema } from "../interfaces";

export const createCinema = async (cinema: Cinema) => {
  try {
    const isCinemaExist = await prisma.cinema.findFirst({
      where: {
        name: { equals: cinema.name, mode: "insensitive" },
        city: { equals: cinema.city, mode: "insensitive" },
        screeningsHref: cinema.screeningsHref,
        latitude: cinema.latitude,
        longitude: cinema.longitude,
      },
    });

    if (isCinemaExist) {
      console.log(`Cinema already exists: ${cinema.name} (${cinema.city})`);

      return isCinemaExist;
    }

    const createdCinema = await prisma.cinema.create({
      data: cinema,
    });

    console.log(`Cinema created: ${createdCinema.id}`);
    return createdCinema;
  } catch (err) {
    console.log(err);
  }
};
