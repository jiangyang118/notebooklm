/**
 * docController.js
 * Flow 6：文档上传与解析模块
 * 职责：
 *  - 处理文档上传
 *  - 识别文档类型
 *  - 调用文档解析服务
 *  - 写入数据库
 *  - 提供文档列表、文档详情查询
 *  - 已扩展：embedDocument 触发向量化（Flow 8）
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parseDocument } from "../services/docService.js";
import { createDocument, listDocuments as listDocs, getDocumentById } from "../models/Document.js";
import * as embedService from "../services/embedService.js";

export async function uploadDocument(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "no file uploaded" });
    }

    const { path: filePath, originalname, mimetype } = req.file;

    // detect type
    let type = "txt";
    if (mimetype?.includes("pdf")) type = "pdf";
    else if (mimetype?.includes("text")) type = "txt";
    else if (originalname?.toLowerCase()?.endsWith?.(".md")) type = "md";
    else if (mimetype?.includes("html")) type = "html";

    const content = await parseDocument(filePath, type);

    const doc = await createDocument({
      title: originalname,
      type,
      content,
    });

    // cleanup temp file
    try { fs.unlinkSync(filePath); } catch {}

    return res.json({
      success: true,
      doc_id: doc.id,
      title: doc.title,
      type: doc.type,
      message: "document uploaded and parsed",
    });
  } catch (err) {
    console.error("[DocController Error]", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function listDocuments(req, res) {
  try {
    const docs = await listDocs();
    res.json({ success: true, documents: docs });
  } catch (err) {
    console.error("[DocController Error]", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getDocument(req, res) {
  try {
    const id = req.params.id;
    const doc = await getDocumentById(id);
    if (!doc) return res.status(404).json({ success: false, message: "not found" });
    res.json({ success: true, document: doc });
  } catch (err) {
    console.error("[DocController Error]", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function embedDocument(req, res) {
  try {
    const id = req.params.id;
    const doc = await getDocumentById(id);
    if (!doc || !doc.content) {
      return res.status(400).json({ success: false, message: "document not found or empty" });
    }
    const result = await embedService.buildEmbeddings(doc);
    res.json({ success: true, doc_id: doc.id, ...result });
  } catch (err) {
    console.error("[DocController Error]", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

// Named exports already declared above; no re-export block to avoid duplicate export errors.
