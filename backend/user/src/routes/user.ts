import express from 'express'; 
import { logInUser } from '../controllers/user.js';

const router = express.Router();

router.post("/login", logInUser)

export default router;