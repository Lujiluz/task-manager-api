import { Router } from "express";
import { auth } from "../middlewares/auth";
import * as taskController from "../controllers/task.controller";
import { validate } from "../middlewares/validate";
import { createTaskSchema, updateTaskSchema } from "../../shared/validators/task.schema";

const router = Router();

router.get("/my-tasks", auth, taskController.getMyTasks);
router.post("/", auth, validate(createTaskSchema), taskController.create);
router.get("/", taskController.getAll);
router.get("/:id", taskController.getById);
router.put("/:id", auth, validate(updateTaskSchema), taskController.update);
router.delete("/:id", auth, taskController.remove);

export default router;
