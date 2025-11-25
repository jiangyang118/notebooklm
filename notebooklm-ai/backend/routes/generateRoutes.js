/**
 * Flow 11：多模态内容生成模块 路由层
 * 职责：
 *  - 提供多模态生成端点（摘要/音频/视频/思维导图/闪卡/测验/PPT）
 */

import express from "express";
import * as generateController from "../controllers/generateController.js";

const router = express.Router();

router.post("/summary", generateController.generateSummary);
router.post("/audio", generateController.generateAudio);
router.post("/video", generateController.generateVideo);
router.post("/mindmap", generateController.generateMindmap);
router.post("/flashcards", generateController.generateFlashcards);
router.post("/quiz", generateController.generateQuiz);
router.post("/ppt", generateController.generatePpt);

export default router;

