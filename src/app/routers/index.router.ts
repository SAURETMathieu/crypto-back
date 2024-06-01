import express from 'express';
import apiRouter from './api/index.router';

const router = express.Router();

router.use('/api', apiRouter);
router.use('/auth', apiRouter);

export default router;
