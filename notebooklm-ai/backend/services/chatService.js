/**
 * chatService.js
 * Flow 10：RAG Chat 服务层
 *
 * 职责：
 *  - 调用向量检索 vectorSearch 获取相关文档片段
 *  - 构造 RAG Prompt（文档片段 + 用户问题）
 *  - 调用 OpenAI Chat（generateChat）
 *  - 返回回答 answer 及引用的文档片段 citations
 */

import { vectorSearch } from "./searchService.js";
import { generateChat } from "../openai.js";

export async function handleChat({ query, top_k, history }) {
  try {
    const k = Number.isFinite(Number(top_k)) ? Number(top_k) : 5;
    const h = Array.isArray(history) ? history : [];
    console.log(`[RAG Chat] query="${query}", top_k=${k}`);

    const searchResult = await vectorSearch(query, k);
    const results = searchResult?.results || [];

    const contextText = results
      .map((r, idx) => {
        const scoreStr = typeof r.score === "number" && r.score.toFixed ? r.score.toFixed(4) : r.score;
        return `[${idx + 1}] (score=${scoreStr}) doc_id=${r.doc_id}, paragraph=${r.paragraph_index}\n${r.content}`;
      })
      .join("\n\n");

    const systemPrompt = `你是一名专业知识助手。以下是与用户问题相关的文档片段，请基于这些片段进行回答：\n- 优先基于文档内容回答\n- 不要编造不存在的信息\n- 如果文档中没有相关内容，明确说明“文档中未找到相关内容”`;

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "system", content: `文档片段如下：\n${contextText}` },
      ...h,
      { role: "user", content: query },
    ];

    const chatResp = await generateChat(messages);
    if (!chatResp.success) {
      return { success: false, answer: "", citations: results, error: chatResp.error || "chat failed" };
    }

    return {
      success: true,
      answer: chatResp.answer,
      citations: results,
    };
  } catch (err) {
    console.error("[ChatService Error]", err);
    return { success: false, answer: "", citations: [], error: err.message };
  }
}

