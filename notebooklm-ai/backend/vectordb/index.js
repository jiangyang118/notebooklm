/**
 * vectordb/index.js
 * Flow 4：向量数据库抽象层（PgVector / Milvus / Chroma / Qdrant）
 *
 * 依赖：
 * npm install pg pgvector sqlite3
 * npm install @zilliz/milvus2-sdk-node
 * npm install chromadb
 * npm install qdrant-node
 */

const DEFAULT_DB = (process.env.VECTOR_DB || "pgvector").toLowerCase();
let clientMod;

async function loadClient() {
  const kind = DEFAULT_DB;
  if (clientMod) return clientMod;
  try {
    if (kind === "pgvector") clientMod = await import("./pgvectorClient.js");
    else if (kind === "milvus") clientMod = await import("./milvusClient.js");
    else if (kind === "chroma") clientMod = await import("./chromaClient.js");
    else if (kind === "qdrant") clientMod = await import("./qdrantClient.js");
    else clientMod = await import("./pgvectorClient.js"); // fallback
    return clientMod;
  } catch (err) {
    console.error("[VectorDB Error] load client failed:", err);
    throw err;
  }
}

export async function initVectorDB() {
  const mod = await loadClient();
  if (mod?.init) return mod.init();
}

export async function insertEmbedding(params) {
  const mod = await loadClient();
  if (mod?.insertEmbedding) return mod.insertEmbedding(params);
  return { success: false, error: "insertEmbedding not available" };
}

export async function searchEmbedding(embedding, top_k = 5) {
  const mod = await loadClient();
  if (mod?.search) return mod.search(embedding, top_k);
  return [];
}

