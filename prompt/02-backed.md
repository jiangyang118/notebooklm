 
📌 Flow 2：后端主服务器 — 完整可执行 Codex Prompt（扩展旗舰版）

Prompt：Generate Backend Server（扩展增强版）

你是一名高级全栈架构师，请为我生成完整的 backend/server.js 内容。
该文件是整个后端服务的入口，必须遵循企业级规范且可直接运行。

请根据以下详细要求生成完整可运行的 server.js 文件：

⸻

🚀 功能要求

1. 基础功能

必须实现：
	1.	创建 Express 应用
	2.	启动端口 3001
	3.	使用以下中间件：
	•	cors()
	•	express.json({limit:'10mb'})
	•	express.urlencoded({extended:true})
	•	express.static（指向 /public，若不存在需先创建目录）
	4.	加载配置文件 config.js
	5.	按顺序注册路由（即便路由文件为空也要加载）：
	•	/api/chat → chatRoutes
	•	/api/docs → docRoutes
	6.	提供全局错误处理中间件
	7.	控制台启动日志要专业、清晰
	8.	文件中必须包含依赖说明（你要求的）

⸻

📦 2. 依赖说明（必须写进文件顶部注释）

在开头注释里必须写明以下依赖（供后续 Flow 统一安装）：

依赖：
npm install express cors dotenv multer
npm install pg sqlite3 pgvector
npm install @zilliz/milvus2-sdk-node
npm install qdrant-node
npm install chromadb
npm install openai


⸻

📌 3. server.js 代码内容要求

在代码中必须包含以下结构：

⸻

3.1 文件开头：注释（必须包含）

/**
 * server.js
 * NotebookLM-AI 后端主入口。
 *
 * 功能：
 * 1. 初始化 Express 应用
 * 2. 加载全局中间件（CORS, JSON, static）
 * 3. 注册 API 路由（chatRoutes + docRoutes）
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


⸻

3.2 引入依赖

必须包含：

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import config from "./config.js";
import chatRoutes from "./routes/chatRoutes.js";
import docRoutes from "./routes/docRoutes.js";


⸻

3.3 处理 ES Modules 的路径问题（必须）

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


⸻

3.4 初始化 Express 应用

const app = express();


⸻

3.5 中间件注册（必须按顺序）

app.use(cors());
app.use(express.json({limit:"10mb"}));
app.use(express.urlencoded({ extended: true }));

// 托管静态资源目录 /public（若不存在也预留）
app.use("/public", express.static(path.join(__dirname, "public")));


⸻

3.6 加载路由（必须包含）

app.use("/api/chat", chatRoutes);
app.use("/api/docs", docRoutes);

如果 router 文件暂时为空，Codex 仍需加载，不允许报错。

⸻

3.7 全局错误处理中间件（必须）

app.use((err, req, res, next) => {
  console.error("全局错误捕获：", err);
  res.status(500).json({
    success: false,
    message: "服务器开小差了，请稍后重试。",
    error: err.message,
  });
});


⸻

3.8 启动服务（必须写启动日志）

日志格式如下：

🚀 NotebookLM-AI backend server started
📡 Port: 3001
🧩 Loaded routes: /api/chat, /api/docs
🛠  Environment: development / production


⸻

📌 4. 最终输出要求（Codex 必须严格遵守）

文件输出格式如下：

/notebooklm-ai/backend/server.js

<完整 server.js 内容>

不得输出任何解释性文字，只能输出代码文件。

⸻

📌 Flow 2 Prompt 完成 