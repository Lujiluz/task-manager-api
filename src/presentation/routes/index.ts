import { Router } from "express";
import pingRouter from "./ping.route";
import userRouter from "./user.route";
import taskRouter from "./task.route";

const router = Router();

router.use(pingRouter);
router.use("/users", userRouter);
router.use("/tasks", taskRouter);

export default router;
