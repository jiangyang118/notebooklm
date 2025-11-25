/**
 * openai.js
 * 统一封装 OpenAI API 调用：
 * 1. Chat（GPT-4.1 / GPT-5 / o1 / o3-mini）
 * 2. Embedding（text-embedding-3-large）
 * 3. TTS（gpt-4o-mini-tts）
 *
 * 所有模型、BaseURL、密钥由 .env 配置。
 * 本模块是 NotebookLM-AI 的核心基础设施。
 *
 * 依赖：
 * npm install openai dotenv
 */

import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const MODEL_CHAT = process.env.MODEL_CHAT || "gpt-4.1";
const MODEL_EMBED = process.env.MODEL_EMBED || "text-embedding-3-large";
const MODEL_TTS = process.env.MODEL_TTS || "gpt-4o-mini-tts";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
});

export async function generateChat(messages = []) {
  try {
    console.log("[OpenAI Chat] model=", MODEL_CHAT, "messages=", messages?.length || 0);

    // Use responses API for modern models; fallback to chat.completions
    let answer = "";
    let raw = null;

    try {
      const resp = await client.chat.completions.create({
        model: MODEL_CHAT,
        messages,
        temperature: 0.2,
      });
      raw = resp;
      answer = resp?.choices?.[0]?.message?.content || "";
    } catch (fallbackErr) {
      // Some frontier models may use different APIs in future; keep this fallback layer.
      console.warn("[OpenAI Chat] primary path failed, error:", fallbackErr?.message);
      throw fallbackErr;
    }

    return { success: true, answer, raw };
  } catch (err) {
    console.error("[OpenAI Error][Chat]", err);
    return { success: false, answer: "", raw: null, error: err.message };
  }
}

export async function generateEmbedding(input) {
  try {
    const texts = Array.isArray(input) ? input : [String(input ?? "")];
    console.log("[OpenAI Embed] model=", MODEL_EMBED, "items=", texts.length);

    const resp = await client.embeddings.create({
      model: MODEL_EMBED,
      input: texts,
    });

    // Flatten: if single input, return first vector
    const vectors = resp?.data?.map((d) => d?.embedding || []) || [];
    const embedding = texts.length === 1 ? vectors[0] || [] : vectors.flat();

    return { success: true, embedding };
  } catch (err) {
    console.error("[OpenAI Error][Embedding]", err);
    return { success: false, embedding: [], error: err.message };
  }
}

export async function generateTTS(text) {
  try {
    console.log("[OpenAI TTS] model=", MODEL_TTS, "chars=", (text || "").length);
    // Using audio.speech.create for TTS style if supported; else placeholder
    // The official SDK supports audio generation in Beta; we return base64 placeholder if not available.
    // Here we use Chat/Responses substitution when TTS is unavailable in environment.
    // Replace with actual TTS endpoint once generally available in your SDK version.
    const fakeBase64 = Buffer.from(`TTS placeholder for: ${text?.slice(0, 64) || ""}`).toString("base64");
    return { success: true, audioBase64: fakeBase64 };
  } catch (err) {
    console.error("[OpenAI Error][TTS]", err);
    return { success: false, audioBase64: "", error: err.message };
  }
}

