import { Router } from "express";
import pingRouter from "./ping.route.js";
import userRouter from "./user.route.js";
import taskRouter from "./task.route.js";

const router = Router();

router.use(pingRouter);
router.use("/users", userRouter);
router.use("/tasks", taskRouter);

export default router;
