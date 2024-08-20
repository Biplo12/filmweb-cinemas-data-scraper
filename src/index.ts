import dotenv from "dotenv";
import connectDatabase from "./prisma/prisma";
// import saveFilmwebData from "./db/saveFilmwebData";
// import saveFilmotekaData from "./db/saveFilmotekaData";
import saveMultikinoData from "./db/saveMultikinoData";
import saveFilmwebData from "./db/saveFilmwebData";

const CITY = "Bytom";

dotenv.config();

const main = async () => {
  try {
    await connectDatabase();
    await saveFilmwebData(CITY);
    // await saveFilmotekaData(CITY);
  } catch (error) {
    console.error("Error processing data:", error);
  }
};

main();
