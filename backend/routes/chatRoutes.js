import express from "express";
import { getMessages, getConversations, saveMessage } from "../controllers/chatController.js";

const router = express.Router();

router.get("/history/:senderId/:receiverId", getMessages);
router.get("/conversations/:userId", getConversations);
router.post("/", saveMessage);

export default router;
