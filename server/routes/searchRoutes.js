import express from "express";
import { searchAds } from "../controllers/searchAPI.js";

const router = express.Router();

router.get('/', searchAds);
   
export default router;
