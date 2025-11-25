 

📌 Flow 13：README（运行说明）—— 完整可执行 Codex Prompt

Prompt：Generate README.md（NotebookLM-AI 全栈项目）

你是一名高级全栈架构师 + 技术文档作者，现在需要为一个名为 notebooklm-ai 的项目生成一份专业的 README.md。

该项目是一个 NotebookLM 风格的全栈 AI 知识库系统，包含：
	•	后端：Node.js + Express + OpenAI + VectorDB（PgVector / Milvus / Chroma / Qdrant）
	•	前端：Vue3（CDN）+ NotebookLM 风格 UI（三栏布局）
	•	能力：文档上传解析、切片、向量化、向量检索、RAG Chat、多模态内容生成（摘要/音频/视频/思维导图/闪卡/测验/PPT）

你需要根据以下要求，生成一份结构清晰、可直接落地执行的 README.md。

⸻

🎯 README 的目标
	1.	让一个刚拿到代码的人，能在 10–30 分钟之内跑起来整个项目
	2.	让技术负责人从 README 中看懂架构、能力边界与未来扩展点
	3.	方便后续用于投标 Demo、技术评审、内部汇报

⸻

📂 README 必须覆盖的内容结构（使用 Markdown 标题）

请严格使用以下结构和标题（可以适度扩展，但不要少）：
	1.	# notebooklm-ai
	2.	## 1. 项目简介
	3.	## 2. 功能特性
	4.	## 3. 技术架构
	5.	## 4. 目录结构
	6.	## 5. 环境准备
	7.	## 6. 环境变量配置（.env 示例）
	8.	## 7. 启动后端（backend）
	9.	## 8. 启动前端（frontend）
	10.	## 9. 向量库切换说明（PgVector / Milvus / Chroma / Qdrant）
	11.	## 10. 模型切换说明（GPT-4.1 / GPT-5 / o1 / o3-mini 等）
	12.	## 11. API 概览
	13.	## 12. 生产部署建议（Node + Nginx + PM2）
	14.	## 13. 后续扩展方向

下面是各个部分的详细要求。

⸻

🧩 1. 项目简介

简要说明：
	•	这是一个 NotebookLM 风格的开源/自建项目
	•	用途：知识库问答、行业文档检索、报告/摘要/PPT 自动生成
	•	面向什么场景：内部知识库、企业文档、行业报告、教学、多模态内容生产等

风格建议：
两三段文字即可，简洁但专业。

⸻

🧩 2. 功能特性

用列表的形式描述项目支持的核心能力，例如：
	•	✅ 文档上传（PDF / TXT / Markdown）
	•	✅ 文档解析与切片（chunking）
	•	✅ OpenAI Embedding（text-embedding-3-large）
	•	✅ 向量数据库（PgVector / Milvus / Chroma / Qdrant 可切换）
	•	✅ 检索增强问答（RAG Chat）
	•	✅ 多模态生成：摘要 / 音频 TTS / 视频脚本 / 思维导图 / 闪卡 / 测验 / PPT
	•	✅ NotebookLM 风格前端（三栏布局）

⸻

🧩 3. 技术架构

用简洁的文字描述：
	•	后端：Node.js + Express
	•	前端：Vue 3 + CDN
	•	AI：OpenAI Chat / Embedding / TTS
	•	向量库：PgVector / Milvus / Chroma / Qdrant（可通过 .env 切换）
	•	数据库：SQLite / PostgreSQL（Flow 5）

建议附上一个简单的 ASCII 架构图，例如：

[Frontend (Vue3)]
      |
      v
[Backend API (Express)]
      |
      +--> [OpenAI Chat / Embedding / TTS]
      |
      +--> [VectorDB: PgVector / Milvus / Chroma / Qdrant]
      |
      +--> [Relational DB: SQLite / PostgreSQL]


⸻

🧩 4. 目录结构

展示项目的核心结构，例如：

notebooklm-ai/
├── backend/
│   ├── server.js
│   ├── config.js
│   ├── openai.js
│   ├── vectordb/
│   ├── controllers/
│   ├── services/
│   ├── routes/
│   └── models/
└── frontend/
    ├── index.html
    ├── main.js
    └── style.css


⸻

🧩 5. 环境准备

列出前提条件：
	•	Node.js（建议 18+）
	•	npm 或 pnpm
	•	PostgreSQL（如需使用 PgVector）
	•	Milvus / Qdrant / Chroma（可选）
	•	OpenAI 账号 & API Key

⸻

🧩 6. 环境变量配置（.env 示例）

必须给出一个 .env 示例片段，例如：

# OpenAI 基础配置
OPENAI_API_KEY=sk-xxxx
OPENAI_BASE_URL=https://api.openai.com/v1

# 模型配置
MODEL_CHAT=gpt-4.1        # 可选：gpt-4.1 / gpt-4.1-mini / gpt-4o-mini / gpt-5 / o1 / o3-mini
MODEL_EMBED=text-embedding-3-large
MODEL_TTS=gpt-4o-mini-tts

# 数据库类型：sqlite 或 postgres
DB_TYPE=sqlite

# Postgres 连接串（DB_TYPE=postgres 时生效）
DATABASE_URL=postgres://user:password@localhost:5432/notebooklm_ai

# 向量数据库类型：pgvector / milvus / chroma / qdrant
VECTOR_DB=pgvector

# Milvus / Qdrant / Chroma 等连接配置（按需填写）
MILVUS_URL=localhost:19530
QDRANT_URL=http://localhost:6333
CHROMA_DIR=./chroma-data


⸻

🧩 7. 如何运行 backend

需要包含：
	1.	进入 backend 目录
	2.	安装依赖
	3.	创建 .env 文件
	4.	启动服务

示例：

cd backend
npm install

# 复制 .env.example 为 .env，并按需修改配置
cp .env.example .env    # 如果有的话

# 启动服务
node server.js
# 或
npm run dev  # 如果你定义了脚本

说明服务默认监听 http://localhost:3001。

⸻

🧩 8. 如何运行 frontend

因为前端是 Vue3 CDN 方案，可以直接本地打开：

cd frontend
# 用任意静态服务器打开，也可以直接浏览器打开 index.html

# 方式 1：直接文件双击
open index.html

# 方式 2：用 npx serve
npx serve .

说明前端默认请求的后端地址为：http://localhost:3001/api。

⸻

🧩 9. 如何切换向量库（PgVector / Milvus / Chroma / Qdrant）

在这一节中说明：
	•	通过 .env 中的 VECTOR_DB 控制：
	•	VECTOR_DB=pgvector
	•	VECTOR_DB=milvus
	•	VECTOR_DB=chroma
	•	VECTOR_DB=qdrant
	•	不同向量库需要提前准备的环境：
	•	PgVector → Postgres 安装 + CREATE EXTENSION vector
	•	Milvus → Docker / K8s 集群
	•	Qdrant → Docker / 本地服务
	•	Chroma → 本地文件目录

示例说明：

VECTOR_DB=pgvector   # 切换到 pgvector

配合一段简短说明：
不同 VECTOR_DB 时，后端会自动调用不同的 vectordb/*.js 客户端，业务层调用接口保持不变。

⸻

🧩 10. 如何切换模型（GPT-4.1 / GPT-5 / o1 / o3-mini）

说明：
	•	使用 .env 中的：

MODEL_CHAT=gpt-4.1
MODEL_EMBED=text-embedding-3-large
MODEL_TTS=gpt-4o-mini-tts

	•	可以改为：

MODEL_CHAT=gpt-5
# 或
MODEL_CHAT=o1
# 或
MODEL_CHAT=o3-mini

简单说明不同模型的适用场景：
	•	GPT-4.1：平衡能力与成本
	•	GPT-5：更强推理（按你设想写简短说明）
	•	o1 / o3-mini：适合低成本、多轮 RAG 问答

⸻

🧩 11. API 概览（简洁版）

用表格或分节列出主要 API：
	•	文档相关：
	•	POST /api/docs/upload
	•	GET /api/docs/list
	•	GET /api/docs/:id
	•	POST /api/embed/:doc_id
	•	向量检索：
	•	POST /api/search
	•	Chat：
	•	POST /api/chat
	•	多模态生成：
	•	POST /api/generate/summary
	•	POST /api/generate/audio
	•	POST /api/generate/video
	•	POST /api/generate/mindmap
	•	POST /api/generate/flashcards
	•	POST /api/generate/quiz
	•	POST /api/generate/ppt

每类简单写一句用途就可以，不需要贴长 JSON 示例（Flow 8–11 已经做了）。

⸻

🧩 12. 生产部署方案（Node + Nginx + PM2）

必须给出一套可操作性强的部署建议，包含：
	1.	使用 pm2 启动 backend：

cd backend
pm2 start server.js --name notebooklm-backend
pm2 save

	2.	使用 Nginx 做反向代理：

示例 Nginx 配置片段（反代后端 + 前端静态资源）：

server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件（若部署在 /var/www/notebooklm-frontend）
    location / {
        root /var/www/notebooklm-frontend;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # 后端 API 代理
    location /api/ {
        proxy_pass http://127.0.0.1:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}

	3.	建议加上日志、备份、按需对接 HTTPS（证书可用 Certbot）。

⸻

🧩 13. 后续扩展方向

列出一些未来可扩展方向，例如：
	•	接入企业内部身份认证（SSO / OAuth2 / 企业微信 / 钉钉）
	•	接入更多数据源（企业网盘、Git、Confluence）
	•	更细粒度的权限 & 工作区（Workspace）
	•	与行业项目结合（如智慧食堂、AI 营养师、供应链知识库等）

⸻

✅ 最终输出要求（Codex 必须遵守）

你必须只输出一个文件内容，格式如下：

/notebooklm-ai/README.md

<完整 README.md 内容>

	•	README 内容必须是合法 Markdown
	•	不得输出其他文件
	•	不得附加解释性自然语言

⸻

📌 Flow 13 Prompt 结束
 