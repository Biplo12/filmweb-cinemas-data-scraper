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
      console.log(`Cinema ${cinema.name} already exists`);
      return;
    }

    await prisma.cinema.create({
      data: cinema,
    });

    console.log(`Cinema ${cinema.name} created successfully`);
  } catch (err) {
    console.log(err);
  }
};
