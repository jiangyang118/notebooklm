/**
 * chunkService.js
 * Flow 7：文档切片模块
 *
 * 职责：
 *  - 对文档内容进行预处理（清洗）
 *  - 按固定长度切片（chunk）
 *  - 提供 overlap（默认 100）
 *  - 为后续向量化流程提供基础段落数据
 *
 * 后续 Flow（8/9/10）将使用 chunkDocument() 进行 RAG 管线处理。
 */

export function cleanText(text = "") {
  let t = String(text || "");
  t = t.replace(/\r\n?/g, "\n"); // unify newlines
  t = t.replace(/[\u0000-\u001F\u007F]/g, ""); // control chars
  // collapse multiple blank lines
  t = t.split("\n").map((l) => l.trimEnd()).join("\n");
  t = t.replace(/\n{3,}/g, "\n\n");
  // collapse multiple spaces
  t = t.replace(/[ \t]{2,}/g, " ");
  return t.trim();
}

export function chunkDocument(content = "", options = {}) {
  const { maxChunkSize = 800, overlap = 100 } = options;
  const text = cleanText(content);
  const chunks = [];
  let i = 0;
  let index = 0;
  const step = Math.max(1, maxChunkSize - overlap);
  while (i < text.length) {
    const end = Math.min(i + maxChunkSize, text.length);
    const chunk = text.substring(i, end);
    chunks.push({ index, text: chunk });
    index += 1;
    i += step;
  }
  return chunks;
}

export { cleanText as _cleanTextForTest };

