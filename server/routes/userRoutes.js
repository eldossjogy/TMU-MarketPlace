import express from "express";

const router = express.Router();

router.get('/id', () => {console.log("came to user id route")})

export default router;


