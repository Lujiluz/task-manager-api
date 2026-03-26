import { Router } from 'express';
import pingRouter from './ping.route';

const router = Router();

router.use(pingRouter);

export default router;
