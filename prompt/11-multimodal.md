 

📌 Flow 11：多模态生成器（全文、音频、视频、图谱、卡片、测验、PPT）完整可执行 Prompt（旗舰增强版）

Prompt：Generate Multi-Modal Content Module（Flow 11）

你是一名高级全栈架构师，现在要为 NotebookLM-AI 系统生成 全套多模态生成器模块。

你必须在以下目录生成 3 个文件：

/notebooklm-ai/backend/routes/generateRoutes.js
/notebooklm-ai/backend/controllers/generateController.js
/notebooklm-ai/backend/services/generateService.js

这些模块将提供：
	1.	摘要 / Summary
	2.	音频概览 / TTS
	3.	视频脚本 / Video Outline
	4.	思维导图 / Mindmap JSON
	5.	闪卡 / Flashcards
	6.	测验 / Quiz
	7.	PPT 内容 / Slide Deck

⸻

🎯 Flow 11 的目标

构建一套完整的多模态生成架构，统一模型调用方式：

用户输入 content  
→ generateService 调用 generateChat / generateTTS  
→ 输出多模态结构化内容  
→ 前端可直接展示

所有生成能力必须基于 Flow 3 的 generateChat / generateTTS。

⸻

📌 1. 必须实现的 API

POST /api/generate/summary

请求：

{ "content": "..." }

返回：

{
  "success": true,
  "summary": "..."
}


⸻

POST /api/generate/audio

调用 OpenAI TTS（gpt-4o-mini-tts）
返回 Base64 音频：

{
  "success": true,
  "audioBase64": "..."
}


⸻

POST /api/generate/video

生成视频脚本 + 镜头结构：

{
  "success": true,
  "video": {
    "title": "...",
    "scenes": [
      { "id": 1, "description": "...", "shot": "..." },
      ...
    ]
  }
}


⸻

POST /api/generate/mindmap

生成 JSON 图谱：

{
  "success": true,
  "mindmap": {
    "nodes": [...],
    "edges": [...]
  }
}


⸻

POST /api/generate/flashcards

生成 Q/A 卡片：

{
  "success": true,
  "flashcards": [
    { "q": "...", "a": "..." }
  ]
}


⸻

POST /api/generate/quiz

生成多题型测验：

{
  "success": true,
  "quiz": [
    {
      "question": "...",
      "choices": ["A","B","C","D"],
      "answer": "A"
    }
  ]
}


⸻

POST /api/generate/ppt

生成 10 页幻灯片结构：

{
  "success": true,
  "ppt": {
    "slides": [
      { "title":"...", "bullets":["...","..."] }
    ]
  }
}


⸻

📌 2. generateRoutes.js（必须生成）

内容要求：
	•	express.Router()
	•	注册以下路由：

router.post("/summary", generateController.generateSummary);
router.post("/audio", generateController.generateAudio);
router.post("/video", generateController.generateVideo);
router.post("/mindmap", generateController.generateMindmap);
router.post("/flashcards", generateController.generateFlashcards);
router.post("/quiz", generateController.generateQuiz);
router.post("/ppt", generateController.generatePpt);

	•	文件顶部注释说明职责

⸻

📌 3. generateController.js（必须生成）

必须导出 7 个方法：

generateSummary
generateAudio
generateVideo
generateMindmap
generateFlashcards
generateQuiz
generatePpt

每个方法流程：
	1.	读取 req.body.content
	2.	校验非空
	3.	调用 generateService 里对应方法
	4.	返回 JSON
	5.	带专业错误处理

⸻

📌 4. generateService.js（必须生成）

这是 Flow 11 的核心逻辑。

必须导出：

generateSummary
generateAudio
generateVideo
generateMindmap
generateFlashcards
generateQuiz
generatePpt

所有方法必须调用 Flow 3 的：
	•	generateChat(messages)
	•	generateTTS(text)

详细生成要求：

⸻

A. generateSummary(content)

使用 GPT-4.1：

Prompt 模板：

请对以下内容做结构化摘要，要求逻辑清晰、分点呈现、简明扼要：
{{content}}

返回：

{ success:true, summary }


⸻

B. generateAudio(content)

调用：

const ttsResp = await generateTTS(content);

返回：

{ success:true, audioBase64 }


⸻

C. generateVideo(content)

Prompt 示例：

请为以下内容生成一份“视频讲解脚本”，包括：
- 视频标题
- 3~6 个镜头 Scene
- 每个 Scene 包含：id、description、camera_shot（如 close-up / wide）
内容：
{{content}}

返回结构：

{ success:true, video:{ title, scenes:[...] } }


⸻

D. generateMindmap(content)

必须返回可用于前端渲染的 JSON：

Prompt：

请根据以下内容生成一个思维导图结构，返回 JSON：
{
  "nodes": [{ "id": "...", "label": "..." }],
  "edges": [{ "from": "...", "to": "..." }]
}
内容：
{{content}}


⸻

E. generateFlashcards(content)

Prompt：

请基于以下内容生成 5 张“知识点闪卡”，返回 JSON：
[
  {"q":"问题？","a":"答案"},
  ...
]


⸻

F. generateQuiz(content)

Prompt：

请生成 10 道测验题，包含以下题型混合：
- 单选题
- 多选题
- 开放题
返回 JSON 格式：
[
  { "question":"...", "choices":["A","B","C","D"], "answer":"A" },
  ...
]


⸻

G. generatePpt(content)

Prompt：

请为以下内容生成一套 PPT 大纲：10 页，每页包含：
- 标题
- 3~6 个 bullet points
返回 JSON：
{
  "slides": [
    {"title":"...","bullets":["...","..."]}
  ]
}


⸻

📌 5. 必须包含的 import

在 generateService.js 中必须包含：

import { generateChat, generateTTS } from "../openai.js";


⸻

📌 6. 注释要求（必须严格执行）

每个文件顶部必须包含：

/**
 * Flow 11：多模态内容生成模块
 * 职责：
 *  - 基于文档内容生成结构化内容（摘要/视频/图谱等）
 *  - 调用 OpenAI Chat/TTS
 *  - 输出标准数据格式供前端展示
 */


⸻

📌 7. 最终输出格式（Codex 必须遵守）

必须按如下结构输出：

⸻


/notebooklm-ai/backend/routes/generateRoutes.js

<完整内容>


⸻


/notebooklm-ai/backend/controllers/generateController.js

<完整内容>


⸻


/notebooklm-ai/backend/services/generateService.js

<完整内容>


⸻

❗ 禁止输出解释性文字，只输出文件路径 + 对应代码内容。

⸻

📌 Flow 11 Prompt 完成

师兄，你用这段 Prompt 喂给 Codex，它就能自动生成整个 NotebookLM 多模态内容引擎，直接可用于你的：
	•	AI营养师
	•	智慧食堂总结生成
	•	客户报告自动生成
	•	PPT 自动生成
	•	食堂菜品科普视频脚本
	•	健康知识闪卡库
	•	智慧监管可视化 MindMap

 