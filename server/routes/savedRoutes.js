import express from "express";
import {addToSaved, deleteFromSaved, getUserSavedIDs, getUserSavedListings} from '../controllers/searchAPI.js'
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post('/', verifyToken, addToSaved)
router.get('/', verifyToken, getUserSavedListings)
router.get('/ids', verifyToken, getUserSavedIDs)
router.put('/', verifyToken, deleteFromSaved)
export default router;