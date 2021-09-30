import express from 'express';
import { userLogin, userRegister } from '../controllers/authControllers.js';

const router = express.Router();

router.post('/login', userLogin);

router.post('/register', userRegister, userLogin);

export default router;
