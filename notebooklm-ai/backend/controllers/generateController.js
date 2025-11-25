/**
 * Flow 11：多模态内容生成模块 控制器
 * 职责：
 *  - 校验输入 content
 *  - 调用 generateService 完成各类型生成
 *  - 返回统一 JSON 结果
 */

import * as service from "../services/generateService.js";

function requireContent(req, res) {
  const { content } = req.body || {};
  if (!content || !String(content).trim()) {
    res.status(400).json({ success: false, message: "content is required" });
    return null;
  }
  return String(content);
}

export async function generateSummary(req, res) {
  try {
    const content = requireContent(req, res); if (content == null) return;
    const result = await service.generateSummary(content);
    res.json(result);
  } catch (err) {
    console.error("[GenerateController Error][summary]", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function generateAudio(req, res) {
  try {
    const content = requireContent(req, res); if (content == null) return;
    const result = await service.generateAudio(content);
    res.json(result);
  } catch (err) {
    console.error("[GenerateController Error][audio]", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function generateVideo(req, res) {
  try {
    const content = requireContent(req, res); if (content == null) return;
    const result = await service.generateVideo(content);
    res.json(result);
  } catch (err) {
    console.error("[GenerateController Error][video]", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function generateMindmap(req, res) {
  try {
    const content = requireContent(req, res); if (content == null) return;
    const result = await service.generateMindmap(content);
    res.json(result);
  } catch (err) {
    console.error("[GenerateController Error][mindmap]", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function generateFlashcards(req, res) {
  try {
    const content = requireContent(req, res); if (content == null) return;
    const result = await service.generateFlashcards(content);
    res.json(result);
  } catch (err) {
    console.error("[GenerateController Error][flashcards]", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function generateQuiz(req, res) {
  try {
    const content = requireContent(req, res); if (content == null) return;
    const result = await service.generateQuiz(content);
    res.json(result);
  } catch (err) {
    console.error("[GenerateController Error][quiz]", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function generatePpt(req, res) {
  try {
    const content = requireContent(req, res); if (content == null) return;
    const result = await service.generatePpt(content);
    res.json(result);
  } catch (err) {
    console.error("[GenerateController Error][ppt]", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

