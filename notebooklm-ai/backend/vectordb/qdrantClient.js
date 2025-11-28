/**
 * qdrantClient.js
 * Flow 4：Qdrant 向量数据库客户端
 *
 * 依赖（后续需安装）：
 * npm install qdrant-node
 *
 * 职责：
 *  - 初始化 collection（embeddings, vector_size=1536, distance=Cosine）
 *  - 插入向量（upsert）
 *  - Top-K 搜索
 */

import { QdrantClient } from "@qdrant/js-client-rest";

const COLLECTION = "embeddings";
const DIM = 1536;
let client;

export async function init() {
  try {
    const url = process.env.QDRANT_URL || "http://localhost:6333";
    client = new QdrantClient({ url });
    console.debug("[Qdrant] connecting to:", url);

    const collections = await client.getCollections();
    const names = (collections?.collections || []).map((c) => c.name);
    if (!names.includes(COLLECTION)) {
      await client.createCollection(COLLECTION, {
        vectors: { size: DIM, distance: "Cosine" },
      });
    }
    console.debug("[Qdrant] ready");
  } catch (err) {
    console.error("[Qdrant Error][init]", err);
    throw err;
  }
}

export async function insertEmbedding({ doc_id, paragraph_index, content, embedding }) {
  try {
    const id = Math.floor(Math.random() * 1e12);
    await client.upsert(COLLECTION, {
      points: [
        {
          id,
          vector: embedding,
          payload: { doc_id, paragraph_index, content },
        },
      ],
    });
    return { success: true };
  } catch (err) {
    console.error("[Qdrant Error][insert]", err);
    return { success: false, error: err.message };
  }
}

export async function search(queryEmbedding, top_k = 5) {
  try {
    const res = await client.search(COLLECTION, {
      vector: queryEmbedding,
      limit: top_k,
    });
    const results = (res || []).map((p) => ({
      doc_id: p?.payload?.doc_id,
      paragraph_index: p?.payload?.paragraph_index,
      content: p?.payload?.content,
      score: p?.score,
    }));
    return results;
  } catch (err) {
    console.error("[Qdrant Error][search]", err);
    return [];
  }
}
