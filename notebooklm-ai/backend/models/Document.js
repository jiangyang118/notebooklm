/**
 * Document.js
 * Flow 5：文档模型
 *
 * 依赖：
 * npm install sqlite3 pg dotenv
 */

import { initDB, db, runSqlite, getSqlite, allSqlite, query, DB_TYPE } from "./db.js";

await initDB();

export async function createDocument({ title, type, content }) {
  try {
    const created_at = new Date().toISOString();
    if (DB_TYPE === "postgres") {
      const sql = "INSERT INTO Document (title, type, content) VALUES ($1,$2,$3) RETURNING id, title, type, content, created_at";
      const { rows } = await query(sql, [title, type, content]);
      return rows[0];
    } else {
      const sql = "INSERT INTO Document (title, type, content, created_at) VALUES (?,?,?,?)";
      const res = await runSqlite(sql, [title, type, content, created_at]);
      const id = res.lastID;
      return { id, title, type, content, created_at };
    }
  } catch (err) {
    console.error("[Document Model][create]", err);
    throw err;
  }
}

export async function getDocumentById(id) {
  try {
    if (DB_TYPE === "postgres") {
      const { rows } = await query("SELECT id, title, type, content, created_at FROM Document WHERE id=$1", [id]);
      return rows[0] || null;
    } else {
      const row = await getSqlite("SELECT id, title, type, content, created_at FROM Document WHERE id=?", [id]);
      return row || null;
    }
  } catch (err) {
    console.error("[Document Model][getById]", err);
    throw err;
  }
}

export async function listDocuments() {
  try {
    if (DB_TYPE === "postgres") {
      const { rows } = await query("SELECT id, title, type, content, created_at FROM Document ORDER BY id DESC", []);
      return rows;
    } else {
      const rows = await allSqlite("SELECT id, title, type, content, created_at FROM Document ORDER BY id DESC", []);
      return rows;
    }
  } catch (err) {
    console.error("[Document Model][list]", err);
    throw err;
  }
}

