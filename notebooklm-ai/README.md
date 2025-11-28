# notebooklm-ai

## 1. 项目简介

NotebookLM-AI 是一个 NotebookLM 风格的全栈 AI 知识库系统。它支持将企业/行业文档上传后进行解析、切片、向量化与检索，提供 RAG Chat（检索增强问答）与多模态内容生成（摘要、音频、视频脚本、思维导图、闪卡、测验、PPT）等能力，帮助团队快速构建智能知识应用、教学/培训素材与报告/PPT 自动生成流程。

适用场景包括：内部知识库检索、行业报告分析、客户资料整理、教学与培训、多模态内容生产（音频/视频/可视化图谱）等。

## 2. 功能特性

- ✅ 文档上传（PDF / TXT / Markdown / HTML）
- ✅ 文档解析与切片（chunking）
- ✅ OpenAI Embedding（text-embedding-3-large）
- ✅ 向量数据库（PgVector / Milvus / Chroma / Qdrant 可切换）
- ✅ 检索增强问答（RAG Chat）
- ✅ 多模态生成：摘要 / 音频 TTS / 视频脚本 / 思维导图 / 闪卡 / 测验 / PPT
- ✅ NotebookLM 风格前端（三栏布局：Sidebar / DocumentViewer / ChatPanel）

## 3. 技术架构

- 后端：Node.js + Express
- 前端：Vue 3（CDN）
- AI：OpenAI Chat / Embedding / TTS
- 向量库：PgVector / Milvus / Chroma / Qdrant（.env 可切换）
- 数据库：SQLite / PostgreSQL（自动建表）

示意架构：

```
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
```

## 4. 目录结构

```
notebooklm-ai/
├── backend/
│   ├── server.js
│   ├── config.js
│   ├── openai.js
│   ├── package.json
│   ├── public/
│   ├── vectordb/
│   │   ├── index.js
│   │   ├── pgvectorClient.js
│   │   ├── milvusClient.js
│   │   ├── chromaClient.js
│   │   └── qdrantClient.js
│   ├── models/
│   │   ├── db.js
│   │   ├── Document.js
│   │   └── Embedding.js
│   ├── routes/
│   │   ├── chatRoutes.js
│   │   ├── docRoutes.js
│   │   ├── embedRoutes.js
│   │   ├── searchRoutes.js
│   │   └── generateRoutes.js
│   ├── controllers/
│   │   ├── chatController.js
│   │   ├── docController.js
│   │   ├── embedController.js
│   │   ├── searchController.js
│   │   └── generateController.js
│   └── services/
│       ├── chatService.js
│       ├── docService.js
│       ├── chunkService.js
│       ├── embedService.js
│       ├── searchService.js
│       └── generateService.js
└── frontend/
    ├── index.html
    ├── main.js
    └── style.css
```

## 5. 环境准备

- Node.js（建议 18+）
- npm 或 pnpm
- PostgreSQL（如用 PgVector）
- Milvus / Qdrant / Chroma（可选，根据向量库选择）
- OpenAI 账号与 API Key

## 6. 环境变量配置（.env 示例）

```
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
VECTOR_DB=chroma

# Milvus / Qdrant / Chroma 等连接配置（按需填写）
MILVUS_URL=localhost:19530
QDRANT_URL=http://localhost:6333
CHROMA_URL=http://localhost:8000

# 服务端口
PORT=3001
```

## 7. 启动后端（backend）

```
cd notebooklm-ai/backend
npm install

# 创建 .env 并填入上面的示例变量
cp ../.env.example .env  # 如果你创建了 .env.example

# 启动服务
npm run dev
# 或
node server.js

# 服务默认监听 http://localhost:3001
```

## 8. 启动前端（frontend）

前端为 Vue3 CDN 方案，直接打开即可：

```
cd notebooklm-ai/frontend

# 方式 1：直接用浏览器打开 index.html
open index.html

# 方式 2：使用任意静态文件服务器，例如
npx serve .
```

前端默认请求后端地址为 `http://localhost:3001/api`。

## 9. 向量库切换说明（PgVector / Milvus / Chroma / Qdrant）

通过 `.env` 的 `VECTOR_DB` 控制：

- `VECTOR_DB=pgvector`
- `VECTOR_DB=milvus`
- `VECTOR_DB=chroma`
- `VECTOR_DB=qdrant`

不同向量库的准备：

- PgVector → 安装 PostgreSQL 并执行 `CREATE EXTENSION vector;`
- Milvus → 使用 Docker / K8s 集群
- Qdrant → Docker / 本地服务（默认 6333 端口）
- Chroma → 本地目录（可使用内存或指定 `CHROMA_DIR`）

后端会自动加载 `backend/vectordb/*Client.js` 中对应实现，业务层接口保持一致（`initVectorDB/insertEmbedding/searchEmbedding`）。

## 10. 模型切换说明（GPT-4.1 / GPT-5 / o1 / o3-mini 等）

通过 `.env` 指定：

```
MODEL_CHAT=gpt-4.1
MODEL_EMBED=text-embedding-3-large
MODEL_TTS=gpt-4o-mini-tts
```

你也可以改为：

```
MODEL_CHAT=gpt-5
# 或
MODEL_CHAT=o1
# 或
MODEL_CHAT=o3-mini
```

建议：
- GPT-4.1：通用能力、性价比平衡
- GPT-5：更强推理（如已开放）
- o1 / o3-mini：低成本多轮 RAG 问答

## 11. API 概览（简洁版）

- 文档相关：
  - POST `/api/docs/upload`
  - GET `/api/docs/list`
  - GET `/api/docs/:id`
  - POST `/api/docs/:id/embed`（或 POST `/api/embed/:doc_id`）

- 向量检索：
  - POST `/api/search` { query, top_k }

- RAG Chat：
  - POST `/api/chat` { query, top_k?, history? }

- 多模态生成：
  - POST `/api/generate/summary` { content }
  - POST `/api/generate/audio` { content }
  - POST `/api/generate/video` { content }
  - POST `/api/generate/mindmap` { content }
  - POST `/api/generate/flashcards` { content }
  - POST `/api/generate/quiz` { content }
  - POST `/api/generate/ppt` { content }

## 12. 生产部署建议（Node + Nginx + PM2）

- 使用 `pm2` 管理 Node 进程（守护/重启/日志）
- 使用 Nginx 作为反向代理，配置 `/api/` 转发到 Node 服务，静态资源直接由 Nginx 提供
- 关注 `.env` 的密钥管理（建议使用 Vault/Secrets Manager）
- 针对向量库/数据库使用专用实例（Postgres、Milvus、Qdrant 等）

## 13. 后续扩展方向

- 加入鉴权与配额控制（限流）
- 文档解析升级：PDF 真实解析、URL 抓取、表格/字幕解析
- Flow 管线：批量向量化、任务队列、进度查询
- 更细粒度的引用与评分/重排（Rerank）
- 前端导出能力（MD/JSON 一键导出）
