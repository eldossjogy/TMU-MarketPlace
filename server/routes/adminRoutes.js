import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { adminGetAllListings, adminGetQueryListing, adminPostNewListing } from "../controllers/adminAPI.js";

const router = express.Router();

router.get('/get-all-listings', verifyToken, adminGetAllListings)
router.get('/get-all-listings/query', verifyToken, adminGetQueryListing)
router.post('/create-new-listing', verifyToken, adminPostNewListing)


export default router;

