import express from "express";
import { getChat, getChats, getUserChat, sendMessage, updateReadStatus } from "../controllers/chatAPI.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// get all chat of a user
router.get("/all", verifyToken, getUserChat);
router.get("/inbox", verifyToken, getChats);
router.get("/", verifyToken, getChat);

// send a message
router.post("/message", verifyToken, sendMessage);

// update a read-status
router.post("/read-status", verifyToken, updateReadStatus);

export default router;
