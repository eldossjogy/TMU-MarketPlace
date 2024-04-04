import express from "express";
import { homepage, getUserAds, getByID} from "../controllers/adAPI.js";

const router = express.Router();

// get ads by id
router.get("/", getByID);

// get all ads by user id
router.get("/user", getUserAds);

// get homepage ads
router.get("/homepage", homepage);

export default router;
