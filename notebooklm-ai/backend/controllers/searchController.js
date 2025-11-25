/**
 * Flow 9：向量检索模块（Vector Search）
 * 职责：
 *  - 校验 query / top_k
 *  - 调用 searchService.vectorSearch 执行检索
 *  - 返回统一结果
 */

import { vectorSearch } from "../services/searchService.js";

export async function search(req, res) {
  try {
    const { query, top_k } = req.body || {};
    if (!query || !String(query).trim()) {
      return res.status(400).json({ success: false, message: "query is required" });
    }
    const k = Number.isFinite(Number(top_k)) ? Number(top_k) : 5;
    const result = await vectorSearch(String(query), k);
    return res.json(result);
  } catch (err) {
    console.error("[SearchController Error]", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

