import express from "express";
import {createListing, getMyListings, changeListingStatus} from '../controllers/myMarketAPI.js'
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post('/create-new-listing', verifyToken, createListing)
router.get('/my-listings', verifyToken, getMyListings)
router.put('/change-listing-status', verifyToken, changeListingStatus)

export default router;


