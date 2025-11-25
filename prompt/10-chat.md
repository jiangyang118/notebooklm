 
📌 Flow 10：RAG Chat（检索增强回答）完整可执行 Codex Prompt

Prompt：Generate RAG Chat Module（Flow 10）

你是一名高级全栈架构师，现在要为 NotebookLM-AI 系统生成 RAG Chat（检索增强问答）模块。

你必须在以下目录生成 3 个文件：

/notebooklm-ai/backend/routes/chatRoutes.js
/notebooklm-ai/backend/controllers/chatController.js
/notebooklm-ai/backend/services/chatService.js

该模块将：
	•	对外暴露统一的 /api/chat 接口
	•	内部调用 Flow 9 的向量检索（vectorSearch）
	•	内部调用 Flow 3 的 generateChat（OpenAI Chat）
	•	以「文档片段 + 用户问题」的模式构造 RAG Prompt
	•	返回带引用信息的回答（citations）

⸻

🎯 Flow 10 的总体目标

实现一个企业级的 RAG Chat 模块：

用户问题 query
→ 向量检索（Top-K 段落）
→ 构造系统 Prompt + 文档上下文 + 用户问题
→ 调用 OpenAI Chat（GPT-4.1 / GPT-5 / o1 / o3-mini）
→ 返回自然语言回答 + 引用的文档片段（doc_id, paragraph_index, content）

此模块将被前端 Chat 面板直接调用，是整个 NotebookLM-AI 对话体验的核心。

⸻

📌 1. 必须实现的 API

POST /api/chat

请求体（JSON）：

{
  "query": "学校食堂如何通过智慧餐厅系统提升营养管理？",
  "top_k": 5,
  "history": [
    { "role": "user", "content": "之前我问过：如何做智慧餐厅？" },
    { "role": "assistant", "content": "……" }
  ]
}

说明：
	•	query：必填，用户当前问题
	•	top_k：可选，默认 5，用于控制检索片段数量
	•	history：可选，多轮对话上下文（用于追加到 messages）

返回示例：

{
  "success": true,
  "answer": "……（自然语言回答）",
  "citations": [
    {
      "doc_id": 1,
      "paragraph_index": 3,
      "content": "……",
      "score": 0.08
    }
  ]
}

错误返回：

{
  "success": false,
  "message": "错误原因"
}


⸻

📁 2. chatRoutes.js（必须生成）

路径：

/notebooklm-ai/backend/routes/chatRoutes.js

要求：
	1.	使用 express.Router()
	2.	注册路由：

router.post("/", chatController.chat);

	3.	顶部必须有专业注释：

/**
 * chatRoutes.js
 * Flow 10：RAG Chat 路由层
 * 负责将 /api/chat 请求转发到 chatController.chat
 */

	4.	默认导出 router：

export default router;


⸻

📁 3. chatController.js（必须生成）

路径：

/notebooklm-ai/backend/controllers/chatController.js

导出函数：

export async function chat(req, res)

chat() 逻辑：
	1.	从 req.body 读取：
	•	query
	•	top_k
	•	history
	2.	校验 query，为空则返回 400
	3.	调用 chatService.handleChat({ query, top_k, history })
	4.	将结果 answer + citations 返回给前端

示意结构：

const { success, answer, citations } = await chatService.handleChat({...});
return res.json({ success, answer, citations });

必须包含错误处理：

catch (err) {
  console.error("[ChatController Error]", err);
  res.status(500).json({ success: false, message: err.message });
}

文件顶部注释示例：

/**
 * chatController.js
 * Flow 10：RAG Chat 控制器
 * 职责：
 *  - 校验请求参数
 *  - 调用 chatService 完成 RAG 对话
 *  - 返回统一响应格式
 */


⸻

📁 4. chatService.js（必须生成）

路径：

/notebooklm-ai/backend/services/chatService.js

这是 Flow 10 的核心文件。

必须导出：

export async function handleChat({ query, top_k, history })

函数逻辑：

A. 设置默认值

top_k = top_k || 5;
history = history || [];

B. 日志输出

console.log(`[RAG Chat] query="${query}", top_k=${top_k}`);

C. 向量检索（调用 Flow 9）

import { vectorSearch } from "./searchService.js";

const searchResult = await vectorSearch(query, top_k);
const { results } = searchResult;  // results 为检索到的片段列表

results 结构：

[
  {
    doc_id,
    paragraph_index,
    content,
    score
  }
]

D. 构造 RAG Prompt
你必须构造一个 messages 数组，用于传给 generateChat(messages)：

import { generateChat } from "../openai.js";

Prompt 模板（必须实现类似内容）：

你是一名专业知识助手。下面是与用户问题相关的文档片段，请基于这些片段进行回答。
要求：
- 优先基于文档内容回答
- 不要编造不存在的信息
- 如果文档中没有相关信息，明确说明“文档中未找到相关内容”

文档片段：
[1] (score=0.08) 来自文档 doc_id=1, 段落 3：
content...

[2] ...

用户问题：{{query}}

在代码中，构造 messages 示例：

const contextText = results.map((r, idx) => {
  return `[${idx + 1}] (score=${r.score?.toFixed?.(4) ?? r.score}) doc_id=${r.doc_id}, paragraph=${r.paragraph_index}\n${r.content}`;
}).join("\n\n");

const systemPrompt = `你是一名专业知识助手。以下是与用户问题相关的文档片段，请基于这些片段进行回答：
- 优先基于文档内容回答
- 不要编造不存在的信息
- 如果文档中没有相关内容，明确说明“文档中未找到相关内容”`;

const messages = [
  { role: "system", content: systemPrompt },
  { role: "system", content: `文档片段如下：\n${contextText}` },
  ...history, // 历史多轮对话
  { role: "user", content: query }
];

E. 调用 OpenAI Chat（Flow 3）

const chatResp = await generateChat(messages);

generateChat 应返回：

{
  success: true,
  answer: "……",
  raw: <原始响应对象>
}

F. 返回结构
handleChat 必须返回：

return {
  success: true,
  answer: chatResp.answer,
  citations: results
};

错误情况：

catch (err) {
  console.error("[ChatService Error]", err);
  return { success: false, answer: "", citations: [], error: err.message };
}

顶部注释示例：

/**
 * chatService.js
 * Flow 10：RAG Chat 服务层
 *
 * 职责：
 *  - 调用向量检索 vectorSearch 获取相关文档片段
 *  - 构造 RAG Prompt（文档片段 + 用户问题）
 *  - 调用 OpenAI Chat（generateChat）
 *  - 返回回答 answer 及引用的文档片段 citations
 */


⸻

📌 5. 必须的 import（Codex 需要自动补齐）

在 chatService.js 中：

import { vectorSearch } from "./searchService.js";
import { generateChat } from "../openai.js";


⸻

📌 6. 最终输出格式要求

Codex 必须严格按如下格式输出 3 个文件：

⸻


/notebooklm-ai/backend/routes/chatRoutes.js

<完整内容>


⸻


/notebooklm-ai/backend/controllers/chatController.js

<完整内容>


⸻


/notebooklm-ai/backend/services/chatService.js

<完整内容>


⸻

❗ 禁止输出任何解释性自然语言，只能输出文件路径 + 对应代码内容。

⸻

✅ Flow 10 Prompt 完成

这样，Flow 10 就变成了一个标准的 RAG Chat 模块 Prompt：
	•	输入：用户问题 + 可选历史
	•	中间：向量检索 + OpenAI Chat
	•	输出：自然语言答案 + 所依据的文档片段列表（citations）
 