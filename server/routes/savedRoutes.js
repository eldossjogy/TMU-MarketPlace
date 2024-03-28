import express from "express";
import {addToSaved, deleteFromSaved, getUserSavedListings} from '../controllers/searchAPI.js'
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post('/', verifyToken, addToSaved)
router.get('/', verifyToken, getUserSavedListings)
router.delete('/', verifyToken, deleteFromSaved)
export default router;