import express from "express";
import {createListing} from '../controllers/myMarketAPI.js'
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post('/create-new-listing', verifyToken, createListing)
//router.get('/my-listings', verifyToken, getMyListings)


export default router;


