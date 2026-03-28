import { prisma } from "../../src/infrastructure/database/prisma";

export const cleanDb = async () => {
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();
};
