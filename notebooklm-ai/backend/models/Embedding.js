/**
 * Embedding.js
 * Flow 5：嵌入向量模型（本地备份）
 *
 * 依赖：
 * npm install sqlite3 pg dotenv
 */

import { initDB, runSqlite, allSqlite, query, DB_TYPE } from "./db.js";

await initDB();

export async function insertEmbedding({ doc_id, paragraph_index, content, vector }) {
  try {
    const created_at = new Date().toISOString();
    if (DB_TYPE === "postgres") {
      const sql = "INSERT INTO Embedding (doc_id, paragraph_index, content, vector) VALUES ($1,$2,$3,$4) RETURNING id";
      const { rows } = await query(sql, [doc_id, paragraph_index, content, JSON.stringify(vector)]);
      return { success: true, id: rows[0]?.id };
    } else {
      const sql = "INSERT INTO Embedding (doc_id, paragraph_index, content, vector, created_at) VALUES (?,?,?,?,?)";
      const res = await runSqlite(sql, [doc_id, paragraph_index, content, JSON.stringify(vector), created_at]);
      return { success: true, id: res.lastID };
    }
  } catch (err) {
    console.error("[Embedding Model][insert]", err);
    return { success: false, error: err.message };
  }
}

export async function getEmbeddingsByDocId(doc_id) {
  try {
    if (DB_TYPE === "postgres") {
      const { rows } = await query(
        "SELECT id, doc_id, paragraph_index, content, vector, created_at FROM Embedding WHERE doc_id=$1 ORDER BY paragraph_index ASC",
        [doc_id]
      );
      return rows.map((r) => ({ ...r, vector: typeof r.vector === "string" ? JSON.parse(r.vector) : r.vector }));
    } else {
      const rows = await allSqlite(
        "SELECT id, doc_id, paragraph_index, content, vector, created_at FROM Embedding WHERE doc_id=? ORDER BY paragraph_index ASC",
        [doc_id]
      );
      return rows.map((r) => ({ ...r, vector: r.vector ? JSON.parse(r.vector) : [] }));
    }
  } catch (err) {
    console.error("[Embedding Model][listByDoc]", err);
    throw err;
  }
}

export async function deleteEmbeddingsByDocId(doc_id) {
  try {
    if (DB_TYPE === "postgres") {
      await query("DELETE FROM Embedding WHERE doc_id=$1", [doc_id]);
    } else {
      await runSqlite("DELETE FROM Embedding WHERE doc_id=?", [doc_id]);
    }
    return { success: true };
  } catch (err) {
    console.error("[Embedding Model][deleteByDoc]", err);
    return { success: false, error: err.message };
  }
}

