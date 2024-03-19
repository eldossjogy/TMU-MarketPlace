import express from "express";
import {createListing, getMyListings, changeListingStatus, deleteMyListing} from '../controllers/myMarketAPI.js'
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post('/create-new-listing', verifyToken, createListing)
router.get('/my-listings', verifyToken, getMyListings)
router.put('/change-listing-status', verifyToken, changeListingStatus)
router.put('/delete-listing', verifyToken, deleteMyListing)

export default router;


