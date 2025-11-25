一共有12个模块，分别介绍：以下是第一个模块，

# NotebookLM-style Flow Architecture (Arc)

目标：定义一套可扩展、可编排、可批处理的 Flow 体系，用于在多来源资料基础上进行知识蒸馏与跨媒体生成，支持企业级 RAG（pgvector/SQLite）、多模型提供方（OpenAI/Gemini/Mock），并与前端/后端接口、Prompt 规范一致。

## 1. 概览

- 核心对象：Source、Chunk、Flow、Preset、Job、Citation。
- 提供方：LLM（Chat/Generate）、Embeddings（向量）、Parser（URL/PDF/Tabular/Subtitle）。
- 后端职责：
  - 解析/入库/分块/向量化/索引
  - 检索（pgvector → SQLite → TF‑IDF）
  - 问答与生成（统一系统 Prompt + 任务约束）
  - Flow 编排（顺序步骤、上下文传递、引用聚合）
  - 预设 CRUD、批量执行、任务查询
- 前端职责：
  - 来源管理（上传/URL/文本、摘要）
  - Ask（问题、回答、摘要、多受众、引用、复制）
  - Generators（7 类生成、一键导出 MD/JSON）
  - Flow（选择/步骤输入/预设/批量/任务/导出）

## 2. 数据模型

```ts
type Source = {
  id: string
  type: 'text'|'url'|'pdf'|'table'|'subtitle'|string
  name: string
  url?: string
  meta?: Record<string, any>
  text: string
  chunks: Chunk[]
  keywords: string[]
  createdAt: string
  updatedAt: string
}

type Chunk = {
  id: string
  sourceId: string
  index: number
  text: string
  vector?: number[]
}

type Citation = { sourceId: string; sourceName: string; snippet: string; score: number }

type FlowStep = string | { type: string; options?: Record<string, any> }

type FlowResult = {
  id: string
  steps: { id: string; output: { text: string }; citations: Citation[] }[]
  aggregateCitations: Citation[]
  sources: { id: string; name: string }[]
}

type Preset = { id: string; name: string; steps: FlowStep[]; options?: Record<string, any>; createdAt: string; updatedAt: string }

type Job = { id: string; batchId: string; status: 'completed'|'pending'|'failed'; createdAt: string; result?: FlowResult; error?: string }
```

数据库与索引：
- 元数据：`apps/server/data/data.json`
- SQLite 索引：`chunk_vectors(chunk_id TEXT PK, source_id TEXT, text TEXT, vector BLOB, dim INT, updated_at TEXT)`
- pgvector 索引：`chunk_vectors(chunk_id TEXT PK, source_id TEXT, text TEXT, embedding vector(DIM), updated_at TIMESTAMPTZ)`

## 3. Prompt 策略

- 系统 Prompt：从 `prompt/init.md` 加载，拼接到任务级提示头部（systemHeader）。
- 任务约束：
  - 问答：严谨回答 + 多层摘要（短/中/长）+ 场景化（学生/专家/儿童）+ 引用。
  - 生成：严格结构（Audio/Video/MindMap/Report/Flashcards/Quiz/Slides），附引用。
  - Flow：后续步骤`buildGeneratorPromptWithExtraContext`引入上一步输出作为上下文。

## 4. Flow 运行时

执行顺序：
1) 预先对所选来源构建/补全向量（若可用）。
2) 全局上下文片段：用“总体概览要点”查询向量检索 top‑K（或 TF‑IDF），供 summary 使用。
3) 顺序遍历步骤：
   - summary：`buildFlowSummaryPrompt` → LLM。
   - slides/quiz/report/...：`buildGeneratorPromptWithExtraContext(type, extra=上一步输出)` → LLM。
4) 引用：每步采用`pickCitations`（关键词重叠）从选中来源选片段，额外聚合去重。

步骤类型（初始集）：
- `summary | slides | quiz | report | audio_overview | video_overview | mind_map | flashcards`
- 未知类型按 `/api/generate` 兜底（返回 text）。

## 5. 检索与向量

优先级：pgvector → SQLite → TF‑IDF。
- 向量维度/provider：首次构建时记录到 `db.embedding`；检索时使用相同 provider/维度。
- 查询向量缓存：LRU（容量≈200），降低重复嵌入调用开销。

批量重建索引：
- `POST /api/reindex { provider?: string, batch?: number }`；分批嵌入、落 SQLite/pgvector；状态：`GET /api/index/status`。

## 6. 解析与分块

类型与策略：
- URL：fetch→Readability 抽正文；失败则标签清洗。
- PDF：pdfjs-dist 提取每页文本。
- CSV/Excel/JSON 数组：行扁平化为 `col: value | ...` 形式；type=`table`。
- SRT/VTT：时间轴 + 文本合并为行；type=`subtitle`。
- 文本：直接入库；统一按“空行切分”分块，保留顺序索引。

## 7. API 设计（对齐后端现状）

- 健康/元信息：
  - `GET /api/health`、`GET /api/meta`（含 systemPromptBytes）
  - `POST /api/prompts/reload`（重载系统 Prompt）
- 来源：
  - `GET /api/sources`、`GET /api/sources/:id`、`GET /api/sources/:id/summary`
  - `POST /api/sources`（JSON，支持 type=url/pdf/text）
  - `POST /api/sources/upload`（multipart：file+name? 支持 pdf/xlsx/csv/json/srt/vtt/txt/md）
- 检索/问答/生成：
  - `POST /api/ask`（{ question, sourceIds?, topK? }）
  - `POST /api/generate`（{ type, sourceIds?, options? }）
- 向量索引：
  - `POST /api/reindex`、`GET /api/index/status`
- Flow/预设/批量/任务/设置：
  - `GET /api/flows`、`POST /api/flows/run`、`POST /api/flows/reload`
  - `GET/POST/PUT/DELETE /api/flows/presets[/:id]`
  - `POST /api/flows/run-batch`、`GET /api/jobs`、`GET /api/jobs/:id`
  - `GET/POST /api/settings`

## 8. Flow 注册表

- 存放路径：`prompt/flows.json`
- 结构：
```json
{
  "version": 1,
  "flows": [
    { "id": "summary_slides_quiz", "name": "摘要 → PPT → 测验", "steps": [ "summary", {"type":"slides","options":{"template":"商务"}}, "quiz" ] },
    { "id": "summary_report_slides", "name": "摘要 → 报告 → PPT", "steps": [ "summary", {"type":"report","options":{"style":"企业报告"}}, {"type":"slides","options":{"template":"学术"}} ] }
  ]
}
```
- 动态加载：`POST /api/flows/reload`。

## 9. 安全与限流（建议）

- 上传体积限制、mime 白名单。
- 简单限流（每 IP 每分钟 30 次）。
- 错误日志：unhandledRejection/uncaughtException。

## 10. 性能与可观测

- 批量嵌入（64/批）。
- TopK 可配置（settings.defaultTopK）。
- /api/meta 返回 systemPromptBytes、向量后端类型、provider 信息。

## 11. 前端对齐

- Flow UI：
  - Flow 下拉加载 `/api/flows`；切换时填充“步骤（逗号分隔）”。
  - 自定义步骤与注册表流程兼容。
  - 预设 CRUD、逐条来源批跑、导出 MD/JSON、任务列表点击查看详情。

## 12. Roadmap（接入 12 条 Flow）

- 方法：在 `prompt/flows.json` 追加定义，每步可带 `options`。
- 建议流模板：
  1) 摘要→报告→测验（教学）
  2) 摘要→思维导图→Slides（培训）
  3) 数据表→摘要→报告（商业分析）
  4) 字幕→摘要→视频脚本（视频生产）
  5) OCR→摘要→Flashcards（学习巩固）
  6) 多来源→比较表→报告（竞品）
  7) 研报→摘要→Slides→Quiz（内训）
  8) FAQ→意图分类→生成问答库（客服）
  9) API 文档→摘要→任务清单（研发支持）
  10) 市场新闻→多语摘要→报告（出海）
  11) 专利→要点→对比→PPT（知识产权）
  12) 规范→检查清单→测验（合规）

## 13. 统一启动信号

当接收到资料或任务时，先应答：
“已载入，正在构建 NotebookLM-style 智能知识空间。”
随后执行最优策略。

