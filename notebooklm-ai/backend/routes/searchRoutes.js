/**
 * Flow 9：向量检索模块（Vector Search）
 * 职责：
 *  - 对外提供 POST /api/search 接口
 *  - 将请求转发给 searchController.search
 */

import express from "express";
import { search } from "../controllers/searchController.js";

const router = express.Router();

// POST /api/search → 向量检索
router.post("/", search);

export default router;

