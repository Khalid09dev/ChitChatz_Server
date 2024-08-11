import express from 'express';
import { sendMessage } from '../controllers/message.controller.js';
import privateRoute from '../middlewares/privateRoute.js';

const router = express.Router();

router.post('/send/:id', privateRoute, sendMessage);

export default router;