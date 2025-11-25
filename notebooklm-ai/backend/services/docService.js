/**
 * docService.js
 * Flow 6：文档上传与解析模块
 * 职责：
 *  - 处理文档上传
 *  - 识别文档类型
 *  - 调用文档解析服务
 *  - 写入数据库
 *  - 提供文档列表、文档详情查询
 *  - 已扩展 chunkDocument 用于后续嵌入流程。
 */

import fs from "fs";

// Flow 7 integration:
import { cleanText, chunkDocument } from "./chunkService.js";

export async function parseDocument(filePath, fileType) {
  console.debug("[DocService] Parsing file:", filePath);
  try {
    const type = (fileType || "txt").toLowerCase();
    if (type === "pdf") {
      // Mock PDF parse
      return "此内容来自 PDF 解析（mock）：" + filePath;
    }
    if (type === "md" || type === "txt") {
      const raw = fs.readFileSync(filePath, "utf-8");
      return raw;
    }
    if (type === "html") {
      const raw = fs.readFileSync(filePath, "utf-8");
      // very naive strip tags
      return raw.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    }
    // default fallback
    const raw = fs.readFileSync(filePath, "utf-8");
    return raw;
  } catch (err) {
    console.error("[DocService Error][parseDocument]", err);
    throw err;
  }
}

export { cleanText, chunkDocument };

