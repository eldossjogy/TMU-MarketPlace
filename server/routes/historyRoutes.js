import express from "express";
import {addToHistory, getUserHistory} from '../controllers/searchAPI.js'
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post('/', verifyToken, addToHistory)
router.get('/', verifyToken, getUserHistory)
export default router;