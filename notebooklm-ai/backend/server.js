/**
 * server.js
 * NotebookLM-AI 后端主入口。
 *
 * 功能：
 * 1. 初始化 Express 应用
 * 2. 加载全局中间件（CORS, JSON, static）
 * 3. 注册 API 路由（chatRoutes + docRoutes 等）
 * 4. 加载全局配置 config.js
 * 5. 启动 HTTP 服务
 *
 * 依赖（后续需安装）：
 * express / cors / dotenv / multer
 * pg / sqlite3 / pgvector
 * @zilliz/milvus2-sdk-node / qdrant-node / chromadb
 * openai
 *
 * 本文件在 Flow 2 生成，后续 Flow 将完善路由与服务逻辑。
 */

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import dotenv from "dotenv";

import config from "./config.js";
import chatRoutes from "./routes/chatRoutes.js";
import docRoutes from "./routes/docRoutes.js";
import embedRoutes from "./routes/embedRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import generateRoutes from "./routes/generateRoutes.js";
import { initVectorDB } from "./vectordb/index.js";

dotenv.config();

// ESM __dirname helpers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure /public directory exists
const publicDir = path.join(__dirname, "public");
if (!fs.existsSync(publicDir)) {
  try {
    fs.mkdirSync(publicDir, { recursive: true });
  } catch (e) {
    // non-fatal
  }
}

// Initialize app
const app = express();

// Middlewares (ordered)
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(publicDir));

// Health endpoint
app.get("/api/health", (req, res) => {
  res.json({ ok: true, name: "notebooklm-ai", env: process.env.NODE_ENV || "development" });
});

// Routes (load even if modules are minimal)
app.use("/api/chat", chatRoutes);
app.use("/api/docs", docRoutes);
app.use("/api/embed", embedRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/generate", generateRoutes);

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("全局错误捕获：", err);
  res.status(500).json({
    success: false,
    message: "服务器开小差了，请稍后重试。",
    error: err?.message || String(err),
  });
});

// Start server
const PORT = config.port || 3001;
app.listen(PORT, () => {
  console.log("\n\uD83D\uDE80 NotebookLM-AI backend server started");
  console.log(`\uD83D\uDCE1 Port: ${PORT}`);
  console.log("\uD83E\uDDE9 Loaded routes: /api/chat, /api/docs, /api/embed, /api/search, /api/generate");
  console.log(`\uD83D\uDEE0  Environment: ${process.env.NODE_ENV || "development"}`);
  // Initialize vector DB in background (non-fatal on failure)
  initVectorDB().catch((e) => console.warn("[VectorDB init]", e?.message || e));
});
