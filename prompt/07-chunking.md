 

📌 Flow 7：文档切片（Chunking）完整可执行 Codex Prompt（旗舰扩展版）

Prompt：Generate Document Chunk Service（chunkService.js）

你是一名高级全栈架构师，请为 NotebookLM-AI 系统生成 文档切片（chunk）模块。

你必须在：

/notebooklm-ai/backend/services/chunkService.js

创建一个新的文件，并在其中实现通用、可维护、可扩展的 Chunking 工具函数，用于后续 Flow 8（Embedding Pipeline）调用。

此外，你还需要在 docService.js 中插入对 chunkService 的引用（import），并导出 chunkDocument 方法（外部统一调用）。

⸻

🎯 Flow 7 的目标

构建一个高质量的 chunk 处理模块，具备：
	•	文本清洗（去除多余空行、控制符）
	•	文本切片（最长 800 字符）
	•	Overlap（默认 100 字符）
	•	长度边界安全（避免超过 embedding 模型限制）
	•	对 chunk 编号（index）
	•	返回数组结构
	•	可适配未来的 token-based 切片

⸻

📌 1. 文件：chunkService.js 必须实现

路径：

/notebooklm-ai/backend/services/chunkService.js

内容要求：

A. 文件顶部注释（必须）：

/**
 * chunkService.js
 * Flow 7：文档切片模块
 *
 * 职责：
 *  - 对文档内容进行预处理（清洗）
 *  - 按固定长度切片（chunk）
 *  - 提供 overlap（默认 100）
 *  - 为后续向量化流程提供基础段落数据
 *
 * 后续 Flow（8/9/10）将使用 chunkDocument() 进行 RAG 管线处理。
 */


⸻

B. 必须实现以下函数：

1. cleanText(text)

负责：
	•	去掉多余空行
	•	去除连续空格
	•	去除不可见字符
	•	统一换行符

输出：清洗后的字符串

2. chunkDocument(content, options)

默认参数：

{
  maxChunkSize: 800,
  overlap: 100
}

切片逻辑：

while (i < content.length) {
  chunk = content.substring(i, i + maxChunkSize)
  chunks.push({ index, text: chunk })
  i += maxChunkSize - overlap
}

输出结构：

[
  { index:0, text:"..." },
  { index:1, text:"..." }
]

3. 导出模块

必须在文件底部：

export { cleanText, chunkDocument };


⸻

📌 2. 修改 docService.js（必须实现）

在 Flow 6 生成的 /backend/services/docService.js 上，Codex 需要：
	1.	自动添加：

import { cleanText, chunkDocument } from "./chunkService.js";

	2.	在 file header 注释补充说明：
该服务已扩展 chunkDocument 用于后续嵌入流程。
	3.	在 docService 导出中新增：

export { chunkDocument };


⸻

📌 3. 输出要求（Codex 必须严格遵守）

必须按如下形式输出所有文件内容：

⸻


/notebooklm-ai/backend/services/chunkService.js

<完整内容>


⸻


/notebooklm-ai/backend/services/docService.js

<更新后的完整文件内容（包括新引用与 export）>


⸻

❗ 禁止输出任何额外解释性文字。只允许输出文件路径和对应代码内容。

⸻

📌 Flow 7 Prompt 完成 