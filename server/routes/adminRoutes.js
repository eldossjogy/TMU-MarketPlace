import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { adminGetAllListings, adminGetQueryListing, adminPostNewListing, adminDeleteListing, adminUpdateListing, verifyAdmin } from "../controllers/adminAPI.js";
import { adminVerifyToken } from "../middleware/adminAuth.js";

const router = express.Router();

router.get('/verify-admin-privilege', verifyToken, verifyAdmin)
router.get('/get-all-listings', adminVerifyToken, adminGetAllListings)
router.get('/get-all-listings/query', adminVerifyToken, adminGetQueryListing)
router.post('/create-new-listing', adminVerifyToken, adminPostNewListing)
router.put('/delete-listing', adminVerifyToken, adminDeleteListing)
router.put('/update-listing', adminVerifyToken, adminUpdateListing)


export default router;

