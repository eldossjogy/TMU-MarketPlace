import express from "express";
import {fetchUserProfile, editUserProfile} from "../controllers/userAPI.js"
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// given id return user info
router.get('/', fetchUserProfile)

router.put('/', verifyToken, editUserProfile)

export default router;



