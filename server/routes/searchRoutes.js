import express from "express";
import { searchAds } from "../controllers/searchAPI.js";

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({
        data: {
            data: [2],
            message: "hi"
        },
        error: null
    });
});

export default router;
