/**
 * embedController.js
 * Flow 8：文档向量化 Pipeline 控制器
 * 职责：
 *  - 从参数读取 doc_id
 *  - 读取文档并校验
 *  - 调用 embedService.buildEmbeddings(document)
 *  - 返回 chunk 数量及状态
 */

import { getDocumentById } from "../models/Document.js";
import { buildEmbeddings } from "../services/embedService.js";

export async function processDocumentEmbedding(req, res) {
  try {
    const doc_id = req.params.doc_id;
    const doc = await getDocumentById(doc_id);
    if (!doc || !doc.content) {
      return res.status(400).json({ success: false, message: "document not found or empty" });
    }
    const result = await buildEmbeddings(doc);
    return res.json({ success: true, doc_id: doc.id, ...result });
  } catch (err) {
    console.error("[EmbedController Error]", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

