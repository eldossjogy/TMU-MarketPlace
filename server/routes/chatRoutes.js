import express from "express";
import { getChats, getUserChat, sendMessage_With_ChatID, sendMessage_With_ListID, updateReadStatus } from "../controllers/chatAPI.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// get all chat of a user
router.get("/all", verifyToken, getUserChat);
router.get("/inbox", verifyToken, getChats);

// send a message -- with chat_id 
router.post("/message",verifyToken, sendMessage_With_ChatID);
// send a message -- with list_id
// verifyToken,
router.put("/message",verifyToken, sendMessage_With_ListID);
// update a read-status
router.post("/read-status", verifyToken, updateReadStatus);

export default router;
