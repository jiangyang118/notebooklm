/**
 * chatRoutes.js
 * Flow 10：RAG Chat 路由层
 * 负责将 /api/chat 请求转发到 chatController.chat
 */

import express from "express";
import { chat } from "../controllers/chatController.js";

const router = express.Router();

router.post("/", chat);

export default router;

