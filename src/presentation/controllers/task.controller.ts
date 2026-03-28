import { RequestHandler } from "express";
import * as taskService from "../../application/services/task.service.js";

export const create: RequestHandler = async (req, res) => {
  const task = await taskService.create(req.body, req.user!.id);
  res.status(201).json(task);
};

export const getAll: RequestHandler = async (_req, res) => {
  const tasks = await taskService.getAll();
  res.json(tasks);
};

export const getMyTasks: RequestHandler = async (req, res) => {
  const tasks = await taskService.getMyTasks(req.user!.id);
  res.json(tasks);
};

export const getById: RequestHandler = async (req, res) => {
  const task = await taskService.getById(req.params.id as string);
  res.json(task);
};

export const update: RequestHandler = async (req, res) => {
  const task = await taskService.update(req.params.id as string, req.user!.id, req.body);
  res.json(task);
};

export const remove: RequestHandler = async (req, res) => {
  await taskService.remove(req.params.id as string, req.user!.id);
  res.status(204).send();
};
