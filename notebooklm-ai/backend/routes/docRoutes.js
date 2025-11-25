/**
 * docRoutes.js
 * Flow 6：文档上传与解析模块
 * 职责：
 *  - 处理文档上传
 *  - 识别文档类型
 *  - 调用文档解析服务
 *  - 写入数据库
 *  - 提供文档列表、文档详情查询
 */

import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { uploadDocument, listDocuments, getDocument, embedDocument } from "../controllers/docController.js";

const router = express.Router();

// Ensure tmp upload dir exists
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "../../tmp/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

// Routes
// POST /api/docs/upload → 上传并解析文档
router.post("/upload", upload.single("file"), uploadDocument);

// GET /api/docs/list → 获取文档列表
router.get("/list", listDocuments);

// GET /api/docs/:id → 获取文档详情
router.get("/:id", getDocument);

// POST /api/docs/:id/embed → 触发该文档向量化（Flow 8 附加）
router.post("/:id/embed", embedDocument);

export default router;

