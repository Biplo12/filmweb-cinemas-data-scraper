import dotenv from "dotenv";
import connectDatabase from "./prisma/prisma";
// import saveFilmwebData from "./db/saveFilmwebData";
// import saveFilmotekaData from "./db/saveFilmotekaData";
import saveMultikinoData from "./db/saveMultikinoData";
import saveFilmwebData from "./db/saveFilmwebData";
import fs from "fs";

const CITY = "Bytom";

const envPath = fs.existsSync(".env.local") ? ".env.local" : ".env.production";
dotenv.config({ path: envPath });

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
