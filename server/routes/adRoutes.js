import express from "express";
import { homepage, getUserAds, getByID, get3ListingsByID } from "../controllers/adAPI.js";

const router = express.Router();

// get ads by id
router.get("/", getByID);
router.get("/similarListings", get3ListingsByID);

// get user ads
router.get("/me", getUserAds);

// get homepage ads
router.get("/homepage", homepage);

export default router;
