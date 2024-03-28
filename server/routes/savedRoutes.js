import express from "express";
import {addToSaved, getUserSavedListings} from '../controllers/searchAPI.js'
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post('/', verifyToken, addToSaved)
router.get('/', verifyToken, getUserSavedListings)
export default router;