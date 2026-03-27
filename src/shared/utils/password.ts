import bcrypt from "bcrypt";
const ROUNDS = 10;

export const hash = (plain: string): Promise<string> => {
  return bcrypt.hash(plain, ROUNDS);
};

export const compare = (plain: string, hashed: string): Promise<boolean> => {
  return bcrypt.compare(plain, hashed);
};
