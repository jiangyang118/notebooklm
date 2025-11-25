/**
 * chatController.js
 * Flow 10：RAG Chat 控制器
 * 职责：
 *  - 校验请求参数
 *  - 调用 chatService 完成 RAG 对话
 *  - 返回统一响应格式
 */

import { handleChat } from "../services/chatService.js";

export async function chat(req, res) {
  try {
    const { query, top_k, history } = req.body || {};
    if (!query || !String(query).trim()) {
      return res.status(400).json({ success: false, message: "query is required" });
    }
    const result = await handleChat({ query: String(query), top_k, history });
    const { success, answer, citations, error } = result;
    return res.json({ success, answer, citations, error });
  } catch (err) {
    console.error("[ChatController Error]", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

