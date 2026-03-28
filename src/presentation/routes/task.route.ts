import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import * as taskController from "../controllers/task.controller.js";
import { validate } from "../middlewares/validate.js";
import { createTaskSchema, updateTaskSchema } from "../../shared/validators/task.schema.js";

const router = Router();

router.get("/my-tasks", auth, taskController.getMyTasks);
router.post("/", auth, validate(createTaskSchema), taskController.create);
router.get("/", taskController.getAll);
router.get("/:id", taskController.getById);
router.put("/:id", auth, validate(updateTaskSchema), taskController.update);
router.delete("/:id", auth, taskController.remove);

export default router;
