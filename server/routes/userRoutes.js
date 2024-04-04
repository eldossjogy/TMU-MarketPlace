import express from "express";
import {fetchUserProfile} from "../controllers/userAPI.js"

const router = express.Router();

// given id return user info
router.get('/', fetchUserProfile)

export default router;



