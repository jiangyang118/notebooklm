/**
 * Flow 9：向量检索模块（Vector Search）
 * 职责：
 *  - 将用户 query 转为 embedding
 *  - 查询向量数据库（PgVector/Milvus/Chroma/Qdrant）
 *  - 标准化检索结果
 *  - 提供统一 API 给 Chat/RAG 使用
 */

import { generateEmbedding } from "../openai.js";
import { searchEmbedding } from "../vectordb/index.js";

export async function vectorSearch(query, top_k = 5) {
  try {
    console.log(`[VectorSearch] query="${query}", top_k=${top_k}`);
    const embResp = await generateEmbedding(query);
    if (!embResp.success) {
      return { success: false, results: [], message: embResp.error || "embedding failed" };
    }
    const results = await searchEmbedding(embResp.embedding, top_k);
    return { success: true, results };
  } catch (err) {
    console.error("[SearchService Error]", err);
    return { success: false, results: [], message: err.message };
  }
}

