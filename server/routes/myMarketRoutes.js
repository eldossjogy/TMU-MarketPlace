import express from "express";
import {createListing, getMyListings, changeListingStatus, deleteMyListing, getUserSpecificListingForEdit, updateListing} from '../controllers/myMarketAPI.js'
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post('/create-new-listing', verifyToken, createListing)
router.get('/my-listings', verifyToken, getMyListings)
router.get('/get-my-listing/:adId', verifyToken, getUserSpecificListingForEdit)
router.put('/change-listing-status', verifyToken, changeListingStatus)
router.put('/delete-listing', verifyToken, deleteMyListing)
router.put('/update-listing', verifyToken, updateListing)

export default router;


