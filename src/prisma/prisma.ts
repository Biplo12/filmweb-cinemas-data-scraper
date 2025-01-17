import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

const connectDatabase = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected successfully", new Date());
  } catch (error) {
    console.error("Error connecting to the database", error);
    process.exit(1);
  }
};

export default connectDatabase;
