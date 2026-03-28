import { prisma } from "../../infrastructure/database/prisma";
import { AppError } from "../../shared/errors/AppError";
import { signToken } from "../../shared/utils/jwt";
import { compare, hash } from "../../shared/utils/password";

export const register = async (data: { name: string; email: string; password: string }) => {
  const hashed = await hash(data.password);
  return prisma.user.create({
    data: { ...data, password: hashed },
    omit: { password: true },
  });
};

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError("Invalid credentials", 401);

  const valid = await compare(password, user.password);
  if (!valid) throw new AppError("Invalid credentials", 401);

  const token = signToken({ id: user.id, email: user.email });
  const { password: _, ...safeUser } = user;
  return { token, user: safeUser };
};

export const getAll = async () => await prisma.user.findMany({ omit: { password: true } });

export const getById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    omit: { password: true },
  });
  if (!user) throw new AppError("User not found", 404);
  return user;
};

export const update = async (id: string, data: { name?: string; email?: string }) =>
  await prisma.user.update({
    where: { id },
    data,
    omit: { password: true },
  });

export const remove = async (id: string) => await prisma.user.delete({ where: { id } });

export const getUserTask = async (id: string) => await prisma.task.findMany({ where: { userId: id } });
