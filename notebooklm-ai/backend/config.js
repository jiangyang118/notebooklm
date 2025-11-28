/**
 * config.js
 * 全局配置加载器
 * - 读取 .env 并提供默认值
 * - 导出统一的运行时配置
 */
import dotenv from "dotenv";
dotenv.config();

const config = {
  port: parseInt(process.env.PORT || "3001", 10),
  env: process.env.NODE_ENV || "development",
  db: {
    type: (process.env.DB_TYPE || "sqlite").toLowerCase(), // sqlite | postgres
    url: process.env.DATABASE_URL || "",
  },
  vectorDB: (process.env.VECTOR_DB || "chroma").toLowerCase(), // pgvector | milvus | chroma | qdrant
  openai: {
    apiKey: process.env.OPENAI_API_KEY || "",
    baseURL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
    modelChat: process.env.MODEL_CHAT || "gpt-4.1",
    modelEmbed: process.env.MODEL_EMBED || "text-embedding-3-large",
    modelTTS: process.env.MODEL_TTS || "gpt-4o-mini-tts",
  },
};

export default config;
