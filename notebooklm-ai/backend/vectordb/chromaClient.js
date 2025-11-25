/**
 * chromaClient.js
 * Flow 4：ChromaDB 向量数据库客户端
 *
 * 依赖（后续需安装）：
 * npm install chromadb
 *
 * 职责：
 *  - 初始化本地/内存 Chroma 集合（embeddings）
 *  - 插入向量（metadata 包含 doc_id / paragraph_index / content）
 *  - Top-K 搜索
 */

import { ChromaClient, OpenAIEmbeddingFunction } from "chromadb";

let client;
let collection;
const COLLECTION = "embeddings";

export async function init() {
  try {
    const path = process.env.CHROMA_DIR || undefined; // undefined → in-memory
    client = new ChromaClient({ path });
    collection = await client.getOrCreateCollection({ name: COLLECTION });
    console.debug("[Chroma] ready at", path || "memory");
  } catch (err) {
    console.error("[Chroma Error][init]", err);
    throw err;
  }
}

export async function insertEmbedding({ doc_id, paragraph_index, content, embedding }) {
  try {
    const id = `${doc_id}:${paragraph_index}:${Math.random().toString(36).slice(2, 8)}`;
    await collection.add({
      ids: [id],
      embeddings: [embedding],
      metadatas: [{ doc_id, paragraph_index, content }],
    });
    return { success: true };
  } catch (err) {
    console.error("[Chroma Error][insert]", err);
    return { success: false, error: err.message };
  }
}

export async function search(queryEmbedding, top_k = 5) {
  try {
    const res = await collection.query({ queryEmbeddings: [queryEmbedding], nResults: top_k });
    const results = [];
    const ids = res?.ids?.[0] || [];
    const metadatas = res?.metadatas?.[0] || [];
    const distances = res?.distances?.[0] || [];
    for (let i = 0; i < ids.length; i++) {
      const m = metadatas[i] || {};
      results.push({
        doc_id: m.doc_id,
        paragraph_index: m.paragraph_index,
        content: m.content,
        score: distances[i],
      });
    }
    return results;
  } catch (err) {
    console.error("[Chroma Error][search]", err);
    return [];
  }
}

