import express from "express";
import { getUserChat, sendMessage, updateReadStatus } from "../controllers/chatAPI.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// get all chat of a user
router.get("/all", verifyToken, getUserChat);

// send a message
router.post("/message", verifyToken, sendMessage);

// update a read-status
router.post("/read-status", verifyToken, updateReadStatus);

export default router;
