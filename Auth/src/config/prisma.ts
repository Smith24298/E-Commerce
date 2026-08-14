import environment from "./env";
import {PrismaPg} from "@prisma/adapter-pg";
import {PrismaClient} from "../../generated/prisma/client";


const connectionString = environment.DATABASE_URL as string;

export const prisma = new PrismaClient({
  adapter: new PrismaPg(connectionString),
});

