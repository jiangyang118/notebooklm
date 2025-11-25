/**
 * embedService.js
 * Flow 8：文档向量化 Pipeline
 *
 * 职责：
 * - 将文档内容 chunk 化
 * - 用 OpenAI embedding-3-large 生成向量
 * - 写入向量数据库（PgVector / Milvus / Chroma / Qdrant）
 * - 备份向量到 SQLite/Postgres Embedding 表
 */

import { cleanText, chunkDocument } from "./chunkService.js";
import { generateEmbedding } from "../openai.js";
import { insertEmbedding as insertLocalEmbedding } from "../models/Embedding.js";
import { initVectorDB, insertEmbedding as insertVectorDB } from "../vectordb/index.js";

let vectorReady = false;
async function ensureVector() {
  if (!vectorReady) {
    await initVectorDB();
    vectorReady = true;
  }
}

export async function buildEmbeddings(document) {
  try {
    console.log(`[Embedding] Start doc_id=${document.id}, title=${document.title}`);
    await ensureVector();

    const cleaned = cleanText(document.content || "");
    const chunks = chunkDocument(cleaned);

    for (const c of chunks) {
      const embResp = await generateEmbedding(c.text);
      if (!embResp.success) {
        console.warn("[Embedding] embed failed at index=", c.index, embResp?.error);
        continue;
      }
      // ensure float array
      const vec = (embResp.embedding || []).map((v) => Number(v));

      const payload = {
        doc_id: document.id,
        paragraph_index: c.index,
        content: c.text,
        embedding: vec,
      };
      await insertVectorDB(payload);
      await insertLocalEmbedding({ ...payload, vector: vec });
    }

    return { success: true, chunks: chunks.length, message: "embedding completed" };
  } catch (err) {
    console.error("[EmbedService Error]", err);
    return { success: false, chunks: 0, message: err.message };
  }
}

