 

📌 Flow 12：NotebookLM 前端 UI（Vue3 + 三栏布局）完整可执行 Codex Prompt（终极旗舰版）

Prompt：Generate NotebookLM Frontend (Vue3 CDN + Figma Token UI)

你是一名高级前端架构师，现在要为 NotebookLM-AI 生成完整的 前端 UI 系统。

你必须生成以下文件：

/notebooklm-ai/frontend/index.html
/notebooklm-ai/frontend/main.js
/notebooklm-ai/frontend/style.css

以及所有必要的 Vue 内嵌组件（通过 <script type="module"> 形式）。

前端必须满足以下高级要求：

⸻

🎯 Flow 12 总目标

构建一个专业级 NotebookLM 风格前端，包括：

1. 三栏布局

左：Sidebar（文档列表 / 上传）
中：Document Viewer（内容展示 + 多模态生成器）
右：Chat Panel（RAG 对话模块）

2. 完整多模态操作区

对应 Flow 11 的所有功能：
	•	Generate Summary
	•	Generate Audio
	•	Generate Video
	•	Generate Mindmap
	•	Generate Flashcards
	•	Generate Quiz
	•	Generate PPT

3. Chat 能力
	•	用户输入框
	•	消息列表（用户 / assistant）
	•	Citations 展示
	•	自动滚动到底部

4. Modal 弹窗

展示：
	•	思维导图 JSON → SVG
	•	PPT slides JSON

5. Token 设计体系（必须实现）

基于 Flow 2.5 的设计规范：

--color-primary
--color-bg
--font-h1
--space-4
--radius-md
--shadow-md
（Codex 需完整生成 Tokens）

6. 所有 API 调用必须通过 axios

后端 API 来自 Flow 6 ~ Flow 11。

⸻

📁 1. index.html（必须实现）

内容要求：
	•	Vue 3 CDN（不使用构建工具）
	•	axios CDN
	•	引入 style.css
	•	基础根元素：

<div id="app"></div>

	•	必须内嵌 3 个大组件结构（通过 <div> 占位）：

<Sidebar />
<DocumentViewer />
<ChatPanel />

	•	必须使用 Flex 三栏布局
	•	文件顶部注释：

<!-- 
Flow 12: NotebookLM 前端 UI
职责：
  - 搭建三栏主界面
  - 接入 Vue 3 应用
  - 渲染 Sidebar / DocumentViewer / ChatPanel
-->


⸻

📁 2. main.js（必须实现）

内容要求：
	•	创建 Vue App
	•	定义全局状态：
	•	selectedDoc
	•	documents
	•	chatMessages
	•	modal states
	•	注册组件（Sidebar / DocumentViewer / ChatPanel）
	•	Axios 全局配置：BASE_URL = “http://localhost:3001/api”

示例：

const app = Vue.createApp({...});
app.component("Sidebar", Sidebar);
app.component("DocumentViewer", DocumentViewer);
app.component("ChatPanel", ChatPanel);
app.mount("#app");


⸻

📁 3. style.css（必须实现）

内容要求：

A. 生成完整 Token：

:root {
  --color-primary: #4A6CF7;
  --color-primary-light: #E8EDFF;
  --color-bg: #FFFFFF;
  --color-surface: #FAFAFA;
  --color-border: #E5E7EB;
  --color-text-primary: #1F2937;
  --color-text-secondary: #6B7280;
  --radius-md: 10px;
  --radius-lg: 14px;
  --shadow-md: 0px 4px 12px rgba(0,0,0,0.08);
  --space-4: 16px;
}

B. 三栏布局样式：

#app { display: flex; height: 100vh; }
.sidebar { width: 260px; border-right: 1px solid var(--color-border); }
.viewer { flex: 1; padding: var(--space-4); overflow-y: auto; }
.chat-panel { width: 360px; border-left: 1px solid var(--color-border); display:flex; flex-direction:column; }

C. 样式必须达到 NotebookLM 级别的简洁美观感

⸻

📁 4. 组件：Sidebar（必须生成）

功能：
	•	列出文档列表（GET /docs/list）
	•	上传文件（POST /docs/upload）
	•	点击文档 → 显示在 DocumentViewer

所需方法：

fetchDocuments()
uploadDocument()
selectDocument(doc)

UI 结构：

左侧文档列表
上传按钮
选中文档高亮


⸻

📁 5. DocumentViewer（必须生成）

功能：
	•	显示文档内容（GET /docs/:id）
	•	多模态生成器按钮组（Flow 11）：

按钮示例：

- 摘要（summary）
- 音频（audio）
- 视频脚本（video）
- 思维导图（mindmap）
- 闪卡（flashcards）
- 测验（quiz）
- PPT（ppt）

生成后的内容需显示在下方区域或弹窗。

⸻

📁 6. ChatPanel（必须生成）

功能：
	•	用户输入框
	•	展示消息（user / assistant）
	•	展示 citations
	•	调用 API：

POST /api/chat

UI 结构：

Chat Messages List
--------------------------------
User Input Box

消息结构：

{
  id,
  role: "user" | "assistant",
  content,
  citations: []
}

自动滚动：

this.$nextTick(() => { /* scroll to bottom */ });


⸻

📁 7. Modal（必须生成）

必须支持至少 2 种：

Mindmap Modal

展示 JSON → 简单 SVG 或预格式化文本。

PPT Modal

展示生成的 slides。

⸻

📌 8. 最终输出要求

Codex 必须严格按如下格式输出：

⸻


/notebooklm-ai/frontend/index.html

<完整 index.html 内容>


⸻


/notebooklm-ai/frontend/main.js

<完整 main.js 内容>


⸻


/notebooklm-ai/frontend/style.css

<完整 style.css 内容>


⸻

❗ 禁止输出任何解释性文本，只输出路径 + 代码。

⸻

📌 Flow 12 Prompt 完成 