import express from "express";
import { searchAds } from "../controllers/searchAPI.js";
import { conditionalVerify } from "../middleware/auth.js";

const router = express.Router();

router.get('/', conditionalVerify, searchAds);
   
export default router;
