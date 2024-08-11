import express from 'express';
import { getMessages, sendMessage } from '../controllers/message.controller.js';
import privateRoute from '../middlewares/privateRoute.js';

const router = express.Router();

router.get('/:id', privateRoute, getMessages);
router.post('/send/:id', privateRoute, sendMessage);

export default router;