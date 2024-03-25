import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { adminGetAllListings, adminGetQueryListing, adminPostNewListing, adminDeleteListing } from "../controllers/adminAPI.js";

const router = express.Router();

router.get('/get-all-listings', verifyToken, adminGetAllListings)
router.get('/get-all-listings/query', verifyToken, adminGetQueryListing)
router.post('/create-new-listing', verifyToken, adminPostNewListing)
router.put('/delete-listing', verifyToken, adminDeleteListing)


export default router;

