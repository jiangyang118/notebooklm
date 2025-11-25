/**
 * embedRoutes.js
 * Flow 8：文档向量化 Pipeline 路由
 * 负责接收文档 ID，触发向量化流程（清洗→切片→嵌入→写库）
 */

import express from "express";
import { processDocumentEmbedding } from "../controllers/embedController.js";

const router = express.Router();

// POST /api/embed/:doc_id → 触发某文档向量化
router.post("/:doc_id", processDocumentEmbedding);

export default router;

