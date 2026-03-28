import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { loginSchema, registerSchema, updateUserSchema } from "../../shared/validators/user.schema.js";
import * as userController from "../controllers/user.controller.js";

const router = Router();

router.post("/", validate(registerSchema), userController.register);
router.post("/login", validate(loginSchema), userController.login);
router.get("/", userController.getAll);
router.get("/:id", userController.getById);
router.put("/:id", validate(updateUserSchema), userController.update);
router.delete("/:id", userController.remove);
router.get("/:id/tasks", userController.getUserTasks);

export default router;
