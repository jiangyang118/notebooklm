 

📌 Flow 9：向量检索模块（Vector Search）完整可执行 Codex Prompt（旗舰增强版）

Prompt：Generate Vector Search Module（Flow 9）

你是一名高级全栈架构师，请在 NotebookLM-AI 后端生成 向量检索模块（Vector Search Layer）。

你必须在以下目录生成 3 个文件：

/notebooklm-ai/backend/routes/searchRoutes.js
/notebooklm-ai/backend/controllers/searchController.js
/notebooklm-ai/backend/services/searchService.js

该模块将被 Flow 10（RAG Chat）直接调用，是整个系统的核心。

⸻

🎯 Flow 9 的核心目标

实现一个完整的向量检索（Vector Search）系统：

用户 query → OpenAI Embedding → 选择向量库（PgVector/Milvus/Chroma/Qdrant）
→ Top-K 搜索 → 返回段落内容、分数、metadata


⸻

📌 1. 必须实现的 API

POST /api/search

请求：

{
  "query": "描述蛋白粉在运动营养中的作用？",
  "top_k": 5
}

返回：

{
  "success": true,
  "results": [
    {
      "doc_id": 1,
      "paragraph_index": 3,
      "content": "……",
      "score": 0.12
    }
  ]
}


⸻

📌 2. searchRoutes.js（必须生成）

要求：
	•	使用 express.Router()
	•	定义：

POST / → searchController.search

	•	注释明确 API 作用

⸻

📌 3. searchController.js（必须生成）

导出：

export async function search(req, res)

search() 逻辑：
	1.	校验 query 是否存在
	2.	设置默认 top_k = 5
	3.	调用 searchService.vectorSearch(query, top_k)
	4.	返回结果

注意：必须使用专业错误处理：

catch (err) {
  console.error("[SearchController Error]", err);
  res.status(500).json({ success:false, message: err.message });
}


⸻

📌 4. searchService.js（必须生成）

这是 Flow 9 的核心文件。

必须导出：

export async function vectorSearch(query, top_k)

必须实现以下流程：

A. 日志

console.log(`[VectorSearch] query="${query}", top_k=${top_k}`);

B. 调用 OpenAI Embedding（Flow 3）

const { embedding } = await generateEmbedding(query);

返回 embedding 数组（1536维 float[]）

C. 调用 VectorDB（Flow 4）

const results = await searchEmbedding(embedding, top_k);

其中 searchEmbedding 来自：

import { searchEmbedding } from "../vectordb/index.js";

D. 标准化结果格式

所有向量库的输出必须统一格式：

{
  doc_id,
  paragraph_index,
  content,
  score
}

E. 最终返回结构

return {
  success: true,
  results
};


⸻

📌 5. 引入模块（Codex 必须添加这些 import）

在 searchService.js：

import { generateEmbedding } from "../openai.js";
import { searchEmbedding } from "../vectordb/index.js";


⸻

📌 6. 注释要求（必须严格实现）

每个文件顶部必须包含：

/**
 * Flow 9：向量检索模块（Vector Search）
 * 职责：
 *  - 将用户 query 转为 embedding
 *  - 查询向量数据库（PgVector/Milvus/Chroma/Qdrant）
 *  - 标准化检索结果
 *  - 提供统一 API 给 Chat/RAG 使用
 */


⸻

📌 7. 最终输出要求（必须遵守）

按如下格式输出所有文件：

⸻


/notebooklm-ai/backend/routes/searchRoutes.js

<完整内容>


⸻


/notebooklm-ai/backend/controllers/searchController.js

<完整内容>


⸻


/notebooklm-ai/backend/services/searchService.js

<完整内容>


⸻

❗ 禁止输出解释性文字，只能输出文件路径与代码内容。

⸻

📌 Flow 9 Prompt 完成
 