import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";
import { logger } from "../../shared/logger";

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 2000;
const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
export const prisma = new PrismaClient({ adapter });

export const connectWithRetry = async (): Promise<void> => {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await prisma.$connect();
      logger.info("database connected successfully!");
      return;
    } catch (err) {
      logger.warn({ err, attempt }, `Database connection failed - attempt: ${attempt}/${MAX_RETRIES}`);
      if (attempt === MAX_RETRIES) {
        logger.error("database connection failed after max retries. Exiting...");
        process.exit(1);
      }

      await new Promise((res) => setTimeout(res, RETRY_DELAY_MS * attempt));
    }
  }
};
