import express from 'express'; 
import { logInUser, verifyUser } from '../controllers/user.js';

const router = express.Router();

router.post("/login", logInUser)
router.post("/verify", verifyUser)

export default router;