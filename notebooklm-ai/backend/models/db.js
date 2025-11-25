/**
 * db.js
 * 数据库初始化模块。
 * - 支持 SQLite / PostgreSQL 自动切换
 * - 提供建表逻辑
 * - 导出 db 实例供 Models 调用
 *
 * 依赖：
 * npm install sqlite3 pg dotenv
 */

import dotenv from "dotenv";
dotenv.config();

const DB_TYPE = (process.env.DB_TYPE || "sqlite").toLowerCase();

let db = null; // sqlite3.Database instance when sqlite
let pgClient = null; // pg.Client when postgres

async function initSqlite() {
  const sqlite3 = await import("sqlite3");
  const path = await import("path");
  const { fileURLToPath } = await import("url");
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const dbPath = path.join(__dirname, "../../notebooklm.db");
  const sqlite = sqlite3.verbose();
  db = new sqlite.Database(dbPath);
  await runSqlite(`CREATE TABLE IF NOT EXISTS Document (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    type TEXT,
    content TEXT,
    created_at TEXT
  );`);
  await runSqlite(`CREATE TABLE IF NOT EXISTS Embedding (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    doc_id INTEGER,
    paragraph_index INTEGER,
    content TEXT,
    vector TEXT,
    created_at TEXT
  );`);
}

function runSqlite(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(this);
    });
  });
}

function allSqlite(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, function (err, rows) {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function getSqlite(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, function (err, row) {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

async function initPostgres() {
  const { Client } = await import("pg");
  pgClient = new Client({ connectionString: process.env.DATABASE_URL });
  await pgClient.connect();
  await pgClient.query(`CREATE TABLE IF NOT EXISTS Document (
    id SERIAL PRIMARY KEY,
    title TEXT,
    type TEXT,
    content TEXT,
    created_at TIMESTAMP DEFAULT NOW()
  );`);
  await pgClient.query(`CREATE TABLE IF NOT EXISTS Embedding (
    id SERIAL PRIMARY KEY,
    doc_id INTEGER,
    paragraph_index INTEGER,
    content TEXT,
    vector JSON,
    created_at TIMESTAMP DEFAULT NOW()
  );`);
}

export async function initDB() {
  if (DB_TYPE === "postgres") {
    await initPostgres();
  } else {
    await initSqlite();
  }
}

export async function query(sql, params = []) {
  if (DB_TYPE === "postgres") {
    return pgClient.query(sql, params);
  }
  throw new Error("query() only available in postgres mode");
}

export { db, allSqlite, getSqlite, runSqlite, DB_TYPE };

