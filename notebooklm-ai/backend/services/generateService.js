/**
 * Flow 11：多模态内容生成模块 服务层
 * 职责：
 *  - 基于文档内容生成结构化内容（摘要/视频/图谱等）
 *  - 调用 OpenAI Chat/TTS
 *  - 输出标准数据格式供前端展示
 */

import { generateChat, generateTTS } from "../openai.js";

function tryParseJSON(text, fallback) {
  try { return JSON.parse(text); } catch { return fallback; }
}

export async function generateSummary(content) {
  try {
    const messages = [
      { role: "system", content: "你是专业的文本摘要助手，请输出简洁的要点。" },
      { role: "user", content: `请对以下内容做结构化摘要，要求逻辑清晰、分点呈现、简明扼要：\n${content}` },
    ];
    const resp = await generateChat(messages);
    return { success: true, summary: resp.answer || "" };
  } catch (err) {
    console.error("[GenerateService Error][summary]", err);
    return { success: false, message: err.message };
  }
}

export async function generateAudio(content) {
  try {
    const tts = await generateTTS(content);
    if (!tts.success) return { success: false, message: tts.error || "tts failed" };
    return { success: true, audioBase64: tts.audioBase64 };
  } catch (err) {
    console.error("[GenerateService Error][audio]", err);
    return { success: false, message: err.message };
  }
}

export async function generateVideo(content) {
  try {
    const messages = [
      { role: "system", content: "你是资深视频编导，输出 JSON。" },
      { role: "user", content: `请为以下内容生成一份“视频讲解脚本”，包括：\n- 视频标题\n- 3~6 个镜头 Scene\n- 每个 Scene 包含：id、description、camera_shot（如 close-up / wide）\n内容：\n${content}\n\n请严格输出 JSON：{\"title\": string, \"scenes\": [{\"id\":number,\"description\":string,\"shot\":string}]}` },
    ];
    const resp = await generateChat(messages);
    const video = tryParseJSON(resp.answer || "", { title: "Auto Video", scenes: [] });
    return { success: true, video };
  } catch (err) {
    console.error("[GenerateService Error][video]", err);
    return { success: false, message: err.message };
  }
}

export async function generateMindmap(content) {
  try {
    const messages = [
      { role: "system", content: "你是知识图谱构建助手，输出 JSON。" },
      { role: "user", content: `根据以下内容生成思维导图 JSON：\n格式：{\"nodes\":[{\"id\":string,\"label\":string}],\"edges\":[{\"from\":string,\"to\":string}]}.\n内容：\n${content}` },
    ];
    const resp = await generateChat(messages);
    const mindmap = tryParseJSON(resp.answer || "", { nodes: [], edges: [] });
    return { success: true, mindmap };
  } catch (err) {
    console.error("[GenerateService Error][mindmap]", err);
    return { success: false, message: err.message };
  }
}

export async function generateFlashcards(content) {
  try {
    const messages = [
      { role: "system", content: "你是学习卡片生成助手，输出 JSON。" },
      { role: "user", content: `根据以下内容生成 8~15 个闪卡 Q/A：\n输出 JSON：[{\"q\":string,\"a\":string}]\n内容：\n${content}` },
    ];
    const resp = await generateChat(messages);
    const flashcards = tryParseJSON(resp.answer || "", []);
    return { success: true, flashcards: Array.isArray(flashcards) ? flashcards : [] };
  } catch (err) {
    console.error("[GenerateService Error][flashcards]", err);
    return { success: false, message: err.message };
  }
}

export async function generateQuiz(content) {
  try {
    const messages = [
      { role: "system", content: "你是测验题库生成助手，输出 JSON。" },
      { role: "user", content: `根据以下内容生成 8~15 道多题型测验（含单选/多选/判断），输出 JSON：[{\"question\":string,\"choices\":["A","B","C","D"],\"answer\":string}]。内容：\n${content}` },
    ];
    const resp = await generateChat(messages);
    const quiz = tryParseJSON(resp.answer || "", []);
    return { success: true, quiz: Array.isArray(quiz) ? quiz : [] };
  } catch (err) {
    console.error("[GenerateService Error][quiz]", err);
    return { success: false, message: err.message };
  }
}

export async function generatePpt(content) {
  try {
    const messages = [
      { role: "system", content: "你是 PPT 结构生成助手，输出 JSON。" },
      { role: "user", content: `根据以下内容生成 8~12 页幻灯片结构。输出 JSON：{\"slides\":[{\"title\":string,\"bullets\":[string]}]}. 内容：\n${content}` },
    ];
    const resp = await generateChat(messages);
    const ppt = tryParseJSON(resp.answer || "", { slides: [] });
    return { success: true, ppt };
  } catch (err) {
    console.error("[GenerateService Error][ppt]", err);
    return { success: false, message: err.message };
  }
}

