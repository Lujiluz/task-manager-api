import { prisma } from "../../infrastructure/database/prisma.js";
import { AppError } from "../../shared/errors/AppError.js";

export const create = (data: { title: string; description?: string; completed?: boolean }, userId: string) => prisma.task.create({ data: { ...data, userId } });

export const getAll = () => prisma.task.findMany({ include: { user: { omit: { password: true } } } });

export const getMyTasks = (userId: string) => prisma.task.findMany({ where: { userId } });

export const getById = async (id: string) => {
  const task = await prisma.task.findUnique({
    where: { id },
    include: { user: { omit: { password: true } } },
  });
  if (!task) throw new AppError("Task not found", 404);
  return task;
};

export const update = async (id: string, userId: string, data: { title?: string; description?: string; completed?: boolean }) => {
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) throw new AppError("Task not found", 404);
  if (task.userId !== userId) throw new AppError("Forbidden access", 403);
  return prisma.task.update({ where: { id }, data });
};

export const remove = async (id: string, userId: string) => {
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) throw new AppError("Task not found", 404);
  if (task.userId !== userId) throw new AppError("Forbidden access", 403);
  return prisma.task.delete({ where: { id } });
};
