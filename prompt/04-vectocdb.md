 

📌 Flow 4：向量数据库客户端（VectorDB Layer）完整扩展 Prompt

Prompt：Generate VectorDB Clients（企业级扩展版）

你是一名高级全栈架构师，请为我生成 一套可插拔、多后端可切换 的向量数据库客户端层（VectorDB Layer），用于 NotebookLM-AI 系统的大规模文档向量检索。

你需要在目录：

/notebooklm-ai/backend/vectordb/

生成 5 个文件：

milvusClient.js
pgvectorClient.js
chromaClient.js
qdrantClient.js
index.js

并为每个客户端生成可直接使用的实现。

⸻

🎯 总体目标

实现一个统一接口的向量数据库抽象层，使业务层可以透明切换：
	•	PgVector（PostgreSQL + HNSW/IVF_FLAT）
	•	Milvus
	•	ChromaDB（本地或内存版）
	•	Qdrant（本地 / Docker / Cloud）

所有客户端必须实现以下统一方法：

export async function init();
export async function insertEmbedding({ doc_id, paragraph_index, content, embedding });
export async function search(queryEmbedding, top_k);


⸻

📌 1. 依赖（必须写入每个文件顶部注释）

npm install pg pgvector sqlite3
npm install @zilliz/milvus2-sdk-node
npm install chromadb
npm install qdrant-node


⸻

📌 2. 通用行为要求（必须全部实现）

所有 VectorDB 客户端必须：
	1.	自动从 .env 读取配置
	2.	文件顶部写明职责
	3.	每个方法都必须有错误捕获
	4.	必须打印关键调试日志（可用 console.debug）
	5.	search() 返回统一结构：

[
  {
    doc_id,
    paragraph_index,
    content,
    score
  }
]

	6.	支持 float embedding（长度 1536）
	7.	支持 top_k 参数（默认 top_k=5）
	8.	插入 / 搜索必须可直接运行
	9.	Milvus / PgVector 必须创建 collection/table + index

⸻

📌 3. 文件内容要求（详细版）

⸻

📁 A. milvusClient.js（必须实现）

要求：
	•	使用 @zilliz/milvus2-sdk-node
	•	Collection 名称：embeddings
	•	schema：
	•	id: auto primary
	•	doc_id: int
	•	paragraph_index: int
	•	content: string
	•	embedding: float[]（dim=1536）
	•	index：IVF_FLAT 或 HNSW
	•	搜索 metric：COSINE

必须实现：

export async function init()
export async function insertEmbedding({...})
export async function search(queryEmbedding, top_k)


⸻

📁 B. pgvectorClient.js（必须实现）

要求：
	•	必须使用 PostgreSQL + pgvector 扩展
	•	自动执行 DDL：

CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE IF NOT EXISTS embeddings (...);


	•	列类型： vector(1536)
	•	创建索引：

CREATE INDEX IF NOT EXISTS embedding_hnsw 
ON embeddings USING hnsw (embedding vector_cosine_ops);

必须实现：

export async function init()
export async function insertEmbedding({...})
export async function search(queryEmbedding, top_k)

search SQL：

SELECT *, embedding <=> $1 AS score
FROM embeddings
ORDER BY embedding <=> $1
LIMIT $2;


⸻

📁 C. chromaClient.js（必须实现）

要求：
	•	使用 chromadb
	•	collection 名称：embeddings
	•	用 embedding 数组作为 vector
	•	metadata 中必须包含：
	•	doc_id
	•	paragraph_index
	•	content

⸻

📁 D. qdrantClient.js（必须实现）

要求：
	•	必须使用 Qdrant Node SDK
	•	collection：embeddings
	•	vector_size: 1536
	•	distance: cosine
	•	插入使用 upsert
	•	搜索使用 search

输出结构必须完全一致。

⸻

📁 E. index.js（必须实现）

要求：
	•	从 .env.VECTOR_DB 读取当前数据库
	•	动态加载对应客户端模块
	•	导出统一方法：

export async function initVectorDB()
export async function insertEmbedding(params)
export async function searchEmbedding(queryEmbedding, top_k)

支持四种值：

pgvector | milvus | chroma | qdrant

默认：pgvector

必须实现自动 fallback 机制：

如果 VECTOR_DB 未指定 → 默认用 PgVector
如果加载失败 → 抛出错误


⸻

📌 最终输出要求（Codex 必须遵守）

必须按以下格式输出所有文件：

/notebooklm-ai/backend/vectordb/milvusClient.js

<完整内容>

/notebooklm-ai/backend/vectordb/pgvectorClient.js

<完整内容>

……
直到：

/notebooklm-ai/backend/vectordb/index.js

<完整内容>

禁止输出额外解释性文字。

⸻

📌 Flow 4 Prompt 完成 