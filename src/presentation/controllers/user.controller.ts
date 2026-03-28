import { RequestHandler } from "express";
import * as userService from "../../application/services/user.service";

export const register: RequestHandler = async (req, res) => {
  const user = await userService.register(req.body);
  res.status(201).json(user);
};

export const login: RequestHandler = async (req, res) => {
  const result = await userService.login(req.body.email, req.body.password);
  res.json(result);
};

export const getAll: RequestHandler = async (_req, res) => {
  const users = await userService.getAll();
  res.json(users);
};

export const getById: RequestHandler = async (req, res) => {
  const user = await userService.getById(req.params.id as string);
  res.json(user);
};

export const update: RequestHandler = async (req, res) => {
  const user = await userService.update(req.params.id as string, req.body);
  res.json(user);
};

export const remove: RequestHandler = async (req, res) => {
  await userService.remove(req.params.id as string);
  res.status(204).send();
};

export const getUserTasks: RequestHandler = async (req, res) => {
  await userService.getUserTask(req.params.id as string);
};
