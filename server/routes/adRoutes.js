import express from "express";
import { homepage, getUserAds, getByID } from "../controllers/adAPI.js";

const router = express.Router();

// get ads by id
router.get("/", getByID);

// get user ads
router.get("/me", getUserAds);

// get homepage ads
router.get("/homepage", homepage);
router.get("/homepage/:categoryId", homepage);

export default router;
