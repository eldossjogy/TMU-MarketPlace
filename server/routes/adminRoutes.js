import express from "express";

const router = express.Router();

router.get('/get-all-tables', () => {console.log("came to admin get all tables route")})

export default router;

