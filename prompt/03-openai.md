 

📌 Flow 3：OpenAI SDK 封装 — 完整可执行 Codex Prompt（旗舰扩展版）

Prompt：Generate OpenAI Wrapper（openai.js）

你是一名高级全栈架构师，请为我生成 backend/openai.js 文件。
该文件用于统一封装 OpenAI 的所有 API 调用，是整个 NotebookLM-AI 系统的核心依赖层。

你必须严格按照以下要求生成一个专业、高内聚、可直接运行的模块。

⸻

🎯 目标

生成的 openai.js 必须：
	1.	使用官方 openai SDK（最新）
	2.	兼容 GPT-4.1 / GPT-4o-mini / GPT-5 / o1 / o3-mini
	3.	支持 embedding-3-large
	4.	支持 gpt-4o-mini-tts（音频）
	5.	自动读取 .env
	6.	导出三个核心方法：

generateChat(messages)
generateEmbedding(text)
generateTTS(text)

	7.	包含专业的错误处理（保证不会让整个系统崩溃）
	8.	每个方法都必须日志化
	9.	使用 async/await + ES Module

⸻

📦 依赖要求（必须写在文件顶部注释中）

文件头部必须包含：

依赖：
npm install openai dotenv


⸻

📌 openai.js 功能要求

1. 顶部注释（必须包含）

/**
 * openai.js
 * 统一封装 OpenAI API 调用：
 * 1. Chat（GPT-4.1 / GPT-5 / o1 / o3-mini）
 * 2. Embedding（text-embedding-3-large）
 * 3. TTS（gpt-4o-mini-tts）
 *
 * 所有模型、BaseURL、密钥由 .env 配置。
 * 本模块是 NotebookLM-AI 的核心基础设施。
 */


⸻

2. 引入依赖

import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();


⸻

3. 读取 ENV 配置（必须）

支持以下字段：

OPENAI_API_KEY=
OPENAI_BASE_URL=https://api.openai.com/v1
MODEL_CHAT=gpt-4.1
MODEL_EMBED=text-embedding-3-large
MODEL_TTS=gpt-4o-mini-tts

要求自动 fallback：

const MODEL_CHAT = process.env.MODEL_CHAT || "gpt-4.1";
const MODEL_EMBED = process.env.MODEL_EMBED || "text-embedding-3-large";
const MODEL_TTS = process.env.MODEL_TTS || "gpt-4o-mini-tts";


⸻

4. 初始化客户端（必须）

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1"
});


⸻

5. generateChat(messages)（必须）

功能要求：
	•	参数：messages: [{role, content}]
	•	调用 Chat Completion
	•	自动判断模型是否为：
	•	gpt-4.1
	•	gpt-4.1-mini
	•	gpt-4o-mini
	•	gpt-5
	•	o1 / o3-mini
	•	返回字符串 answer
	•	捕获错误并打印
	•	返回标准结构：

{
  success: true,
  answer: "",
  raw: <原始响应>
}


⸻

6. generateEmbedding(text)（必须）

功能要求：
	•	使用 text-embedding-3-large
	•	参数：字符串 or 数组自动兼容
	•	返回 embedding 数组
	•	不能返回嵌套结构，需要 flatten

输出格式：

{
  success: true,
  embedding: [0.01, 0.02, ...]
}


⸻

7. generateTTS(text)（必须）

功能要求：
	•	使用模型：gpt-4o-mini-tts
	•	输出 base64 的 mp3 音频
	•	返回格式：

{
  success: true,
  audioBase64: "..."
}


⸻

8. 错误处理（必须专业）

每个方法必须包含：

catch (err) {
  console.error("[OpenAI Error]", err);
  return { success: false, error: err.message };
}


⸻

📌 9. 最终输出要求（Codex 必须遵守）

你必须完全按照文件路径输出：

/notebooklm-ai/backend/openai.js

<完整内容>

不允许包含额外文字。

⸻

📌 Flow 3 Prompt 结束 