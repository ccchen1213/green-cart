import express from 'express';
import { register } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register', register)
userRouter.post('/login', register)

export default userRouter;