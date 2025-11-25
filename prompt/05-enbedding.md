 

📌 Flow 5：数据库模型（Document / Embedding）完整可执行 Prompt（旗舰扩展版）

Prompt：Generate Database Models（db.js + Document.js + Embedding.js）

你是一名高级全栈架构师，现在需要为 NotebookLM-AI 系统生成 数据库模型层（Models Layer），用于管理：
	•	文档表 Document
	•	嵌入向量本地备份表 Embedding（仅 SQLite/PostgreSQL 使用；Milvus/Chroma/Qdrant 仍用 metadata，不影响一致性）
	•	数据库连接与初始化

你的任务是在：

/notebooklm-ai/backend/models/

位置生成 3 个文件：

db.js
Document.js
Embedding.js

并确保它们能被后端服务直接使用（Express + RAG + 向量库）。

⸻

🎯 总体目标

该 Flow 必须实现一个企业级、可扩展、可维护的 Models 层，包括：

1. 支持两种数据库自动切换：
	•	SQLite3（默认）
	•	PostgreSQL（如果 .env 中配置 DB_TYPE=postgres）

2. 自动创建表结构（建表迁移）

包含：
	•	Document 表
	•	Embedding 表（向量保存 JSON，用于 fallback 模式）

3. 连接池 / 实例复用

（避免重复连接）

4. 企业级注释 + 错误处理

⸻

📌 1. 依赖（必须写在文件头注释中）

npm install sqlite3 pg dotenv


⸻

📌 2. 数据表结构（必须实现）

Document 表结构

id                INTEGER / SERIAL PRIMARY KEY
title             TEXT
type              TEXT
content           TEXT
created_at        TIMESTAMP

Embedding 表结构（SQLite / Pg 用，向量库仍用独立存储）

id                INTEGER / SERIAL PRIMARY KEY
doc_id            INTEGER
paragraph_index   INTEGER
content           TEXT
vector            JSON   （存原始 embedding 数组）
created_at        TIMESTAMP


⸻

📌 3. 各文件要求（详细）

⸻

📁 A. db.js（数据库初始化）

功能要求：
	1.	加载 .env → DB_TYPE
	2.	如果是 "sqlite"：
	•	创建 notebooklm.db
	•	使用 sqlite3 verbose 模式
	3.	如果是 "postgres"：
	•	使用 pg.Client
	•	自动连接
	4.	自动执行 DDL：
	•	创建 Document 表
	•	创建 Embedding 表
	5.	导出统一的数据库连接实例：

export const db
export const query()  // postgres

注释示例：

/**
 * db.js
 * 数据库初始化模块。
 * - 支持 SQLite / PostgreSQL 自动切换
 * - 提供建表逻辑
 * - 导出 db 实例供 Models 调用
 */


⸻

📁 B. Document.js（文档模型）

要求：

⦿ 必须导出：

export async function createDocument({title, type, content})
export async function getDocumentById(id)
export async function listDocuments()

⦿ SQLite / PostgreSQL 自动兼容
⦿ 必须包装 try/catch
⦿ 必须打印错误日志

⦿ 返回格式规范：

{
  id,
  title,
  type,
  content,
  created_at
}


⸻

📁 C. Embedding.js（嵌入向量模型）

虽然 Flow 4 中很多 embedding 会存向量数据库，但本地 DB 需要存一份冗余备份，便于：
	•	数据校验
	•	故障回退
	•	前端调试
	•	embedding 调优

必须实现 3 个方法：

export async function insertEmbedding({doc_id, paragraph_index, content, vector})
export async function getEmbeddingsByDocId(doc_id)
export async function deleteEmbeddingsByDocId(doc_id)

约束：
	•	vector 字段必须以 JSON 字符串形式写入
	•	插入时 created_at 自动生成
	•	PostgreSQL 使用参数化 query
	•	SQLite 使用 db.run

⸻

📌 4. 最终输出要求（Codex 必须严格遵守）

你必须按如下结构输出所有文件：

⸻

/notebooklm-ai/backend/models/db.js

<完整模块内容>


⸻

/notebooklm-ai/backend/models/Document.js

<完整模块内容>


⸻

/notebooklm-ai/backend/models/Embedding.js

<完整模块内容>


⸻

禁止输出任何额外解释性文字。

⸻

📌 Flow 5 Prompt 完成
 