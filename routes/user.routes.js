import express from 'express';
import privateRoute from '../middlewares/privateRoute.js';
import { getUsersForSidebar } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/:jwt', privateRoute, getUsersForSidebar);

export default router;