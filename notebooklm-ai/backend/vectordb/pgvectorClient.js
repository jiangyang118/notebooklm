/**
 * pgvectorClient.js
 * Flow 4：PgVector 向量数据库客户端
 *
 * 依赖（后续需安装）：
 * npm install pg pgvector sqlite3
 *
 * 职责：
 *  - 初始化表结构（embeddings）与 HNSW 索引
 *  - 插入向量（vector(1536)）
 *  - Top-K 搜索（COSINE）
 */

import { Client } from "pg";
import { vector } from "pgvector";

const DIM = 1536;
let client;

export async function init() {
  try {
    const connStr = process.env.DATABASE_URL || "postgres://user:pass@localhost:5432/notebooklm_ai";
    client = new Client({ connectionString: connStr });
    await client.connect();
    console.debug("[PgVector] connected");

    await client.query("CREATE EXTENSION IF NOT EXISTS vector;");
    await client.query(`
      CREATE TABLE IF NOT EXISTS embeddings (
        id SERIAL PRIMARY KEY,
        doc_id INTEGER,
        paragraph_index INTEGER,
        content TEXT,
        embedding vector(${DIM})
      );
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS embedding_hnsw
      ON embeddings USING hnsw (embedding vector_cosine_ops);
    `);
    console.debug("[PgVector] schema ready");
  } catch (err) {
    console.error("[PgVector Error][init]", err);
    throw err;
  }
}

export async function insertEmbedding({ doc_id, paragraph_index, content, embedding }) {
  try {
    const emb = vector(embedding);
    await client.query(
      "INSERT INTO embeddings (doc_id, paragraph_index, content, embedding) VALUES ($1,$2,$3,$4)",
      [doc_id, paragraph_index, content, emb]
    );
    return { success: true };
  } catch (err) {
    console.error("[PgVector Error][insert]", err);
    return { success: false, error: err.message };
  }
}

export async function search(queryEmbedding, top_k = 5) {
  try {
    const emb = vector(queryEmbedding);
    const { rows } = await client.query(
      `SELECT doc_id, paragraph_index, content, (embedding <=> $1) AS score
       FROM embeddings
       ORDER BY embedding <=> $1
       LIMIT $2;`,
      [emb, top_k]
    );
    return rows.map((r) => ({
      doc_id: r.doc_id,
      paragraph_index: r.paragraph_index,
      content: r.content,
      score: Number(r.score),
    }));
  } catch (err) {
    console.error("[PgVector Error][search]", err);
    return [];
  }
}

