 

📌 Flow 8：Embedding Pipeline（向量化管线）完整可执行 Codex Prompt（旗舰增强版）

Prompt：Generate Embedding Pipeline（Routes + Controller + Service）

你是一名高级全栈架构师，请为 NotebookLM-AI 构建完整 Embedding Pipeline（文本向量化管线）。

你必须在以下目录自动生成 3 个文件：

/notebooklm-ai/backend/routes/embedRoutes.js
/notebooklm-ai/backend/controllers/embedController.js
/notebooklm-ai/backend/services/embedService.js

并且更新：

/notebooklm-ai/backend/controllers/docController.js

增加「触发文档向量化」的能力。

⸻

🎯 Flow 8 的总目标

构建一个专业级 RAG 向量化模块（Embedding Pipeline）：

Document.content 
→ 清洗(cleanText)
→ 切片(chunkDocument)
→ 调用 OpenAI embedding(text-embedding-3-large)
→ 写入向量数据库（PgVector/Milvus/Chroma/Qdrant）
→ 写入本地 Embedding 表（JSON）
→ 返回 chunk 数量 & 成功状态


⸻

📌 1. 需要生成的 API（必须实现）

1. POST /api/embed/:doc_id

功能：
	•	从数据库读取某文档
	•	调用 embedService.buildEmbeddings(doc)
	•	返回 chunk 数量与 embedding 写入结果

成功返回：

{
  "success": true,
  "doc_id": 1,
  "chunks": 12,
  "message": "embedding completed"
}


⸻

📁 2. embedRoutes.js（必须实现）

内容要求：
	•	express.Router()
	•	定义：

router.post("/:doc_id", embedController.processDocumentEmbedding);

	•	注释必须说明 API 作用

⸻

📁 3. embedController.js（必须实现）

必须导出：

processDocumentEmbedding(req, res)

流程：
	1.	从 req.params.doc_id 获取文档 ID
	2.	调 Document.getDocumentById(doc_id)
	3.	校验 content 是否存在
	4.	调 embedService.buildEmbeddings(document)
	5.	返回成功 JSON

必须包含错误处理：

catch (err) {
  console.error("[EmbedController Error]", err);
  res.status(500).json({ success:false, message: err.message });
}


⸻

📁 4. embedService.js（必须实现）

这是整个 Flow 的核心文件。

必须实现并导出：

export async function buildEmbeddings(document)

具体流程：

A. 打印日志

console.log(`[Embedding] Start doc_id=${document.id}, title=${document.title}`);

B. 清洗文本

const cleaned = cleanText(document.content);

C. 切片 chunkDocument(cleaned)

const chunks = chunkDocument(cleaned);

D. 循环处理每个 chunk：

for each chunk:
    call generateEmbedding(chunk.text)
    call vectorDB.insertEmbedding({...})
    call Embedding.insertEmbedding({...})

其中：
	•	embedding 数组必须为 float[]
	•	content = chunk.text
	•	统一返回：

{
  doc_id,
  paragraph_index,
  content,
  vector
}

E. 构建最终返回：

return {
  success: true,
  chunks: chunks.length
};


⸻

📌 5. 引入外部模块（Codex 必须写入以下 import）

embedService.js 必须引入：

import { cleanText, chunkDocument } from "./chunkService.js";
import { generateEmbedding } from "../openai.js";
import { insertEmbedding as insertLocalEmbedding } from "../models/Embedding.js";
import { Document } from "../models/Document.js"; // optional
import { initVectorDB, insertEmbedding as insertVectorDB } from "../vectordb/index.js";


⸻

📌 6. 修改 docController.js（必须更新文件）

必须在 docController.js 中新增一个导出：

export async function embedDocument(req, res)

该方法：
	1.	从 URL 获取 doc_id
	2.	调用 embedService.buildEmbeddings(doc)
	3.	返回状态

同时在底部加入：

export { uploadDocument, listDocuments, getDocument, embedDocument };

（如果文件已有 export，需要 Codex 追加而不是覆盖其他方法）

⸻

📌 7. 注释要求（所有文件必须加专业头注释）

例如：

/**
 * embedService.js
 * Flow 8：文档向量化 Pipeline
 *
 * 职责：
 * - 将文档内容 chunk 化
 * - 用 OpenAI embedding-3-large 生成向量
 * - 写入向量数据库（PgVector / Milvus / Chroma / Qdrant）
 * - 备份向量到 SQLite/Postgres Embedding 表
 */


⸻

📌 8. 最终输出要求（必须遵守）

必须按如下结构输出所有文件内容：

⸻


/notebooklm-ai/backend/routes/embedRoutes.js

<完整内容>


⸻


/notebooklm-ai/backend/controllers/embedController.js

<完整内容>


⸻


/notebooklm-ai/backend/services/embedService.js

<完整内容>


⸻


/notebooklm-ai/backend/controllers/docController.js

<更新后的完整文件>


⸻

❗ 禁止输出任何解释性文字，只能输出文件路径与代码内容。

⸻

📌 Flow 8 Prompt 完成 