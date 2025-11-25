 

📌 Flow 6：文档上传与解析（Upload + Parse）完整可执行 Prompt（旗舰扩展版）

Prompt：Generate Document Upload & Parse Layer

你是一名高级全栈架构师，现在要为 NotebookLM-AI 系统生成 文档上传与解析模块。

你必须在以下目录生成 3 个文件：

/notebooklm-ai/backend/routes/docRoutes.js
/notebooklm-ai/backend/controllers/docController.js
/notebooklm-ai/backend/services/docService.js

必须按企业级工程标准设计，具备扩展性、容错性、可维护性。

⸻

📂 1. 功能目标（Flow 6 必须实现）

构建完整的文档上传与解析链路：

前端上传文件 → Multer 存临时目录 → 识别类型 → 解析文件内容
→ 入库（Document） → 返回 doc_id


⸻

📌 2. 系统要求（Codex 必须严格遵守）

文档格式要求：
	•	支持 PDF（mock 解析）
	•	支持 TXT
	•	支持 MD（Markdown）
	•	支持 HTML（可选）

必须实现的接口：

POST /api/docs/upload

请求内容：

multipart/form-data
file: <document>

成功返回：

{
  "success": true,
  "doc_id": 1,
  "title": "AI 运动营养白皮书",
  "type": "pdf",
  "message": "document uploaded and parsed"
}

失败返回统一格式：

{
  "success": false,
  "message": "reason"
}


⸻

📁 3. 文件内容要求（详细规范）

⸻

A. docRoutes.js（必须实现）

内容要求：
	1.	使用 express.Router()
	2.	引入 Multer，上传到 /tmp/uploads/
	3.	绑定路由：

POST /upload → docController.uploadDocument
GET /list → docController.listDocuments
GET /:id → docController.getDocument

	4.	注释必须写明每个 API 的职责
	5.	Multer 设置文件大小上限：20MB
	6.	如果 /tmp/uploads 不存在，要创建目录（Codex 自动用 fs.mkdirSync）

⸻

B. docController.js（必须实现）

必须包含 3 个导出方法：

export async function uploadDocument(req, res)
export async function listDocuments(req, res)
export async function getDocument(req, res)

uploadDocument(req, res) 的流程：

1. 校验是否有文件
2. 从 req.file 获取文件信息（path, originalname, mimetype）
3. 判断文件类型（pdf/txt/md/html）
4. 调用 docService.parseDocument(filePath, type)
5. 调用 Document.createDocument()
6. 返回 doc_id 和部分信息
7. 删除临时文件（fs.unlink）

必须支持文件类型判断：

if mimetype.includes("pdf") → type="pdf"
if mimetype.includes("text") → type="txt"
if originalname.endsWith(".md") → type="md"

listDocuments()
	•	调用 Document.listDocuments()
	•	返回数组

getDocument()
	•	req.params.id
	•	调用 Document.getDocumentById()
	•	返回内容

必须使用专业异常处理：

catch (err) {
  console.error("[DocController Error]", err);
  res.status(500).json({ success:false, message: err.message });
}


⸻

C. docService.js（必须实现）

必须实现以下函数：

export async function parseDocument(filePath, fileType)

功能要求：
	1.	PDF（必须 mock 解析）
	•	使用 placeholder 模拟解析：

return "此内容来自 PDF 解析（mock）：" + filePath;


	2.	TXT
	•	使用 fs.readFile UTF-8 读取
	3.	Markdown
	•	读取 raw 文本（无需转 HTML）
	4.	HTML（可选实现）
	•	去掉标签（简单正则）

必须包含：

console.debug("[DocService] Parsing file:", filePath);


⸻

📌 4. 注释要求（必须严格实现）

每个文件必须包含顶部注释：

/**
 * XXX.js
 * Flow 6：文档上传与解析模块
 * 职责：
 *  - 处理文档上传
 *  - 识别文档类型
 *  - 调用文档解析服务
 *  - 写入数据库
 *  - 提供文档列表、文档详情查询
 */

Codex 必须按照该格式生成。

⸻

📌 5. 最终输出要求（必须遵守）

按如下格式输出：

/notebooklm-ai/backend/routes/docRoutes.js

<完整内容>

/notebooklm-ai/backend/controllers/docController.js

<完整内容>

/notebooklm-ai/backend/services/docService.js

<完整内容>

❗ 禁止输出多余解释文本。
只能输出文件路径 + 文件内容。

⸻

📌 Flow 6 Prompt 结束 