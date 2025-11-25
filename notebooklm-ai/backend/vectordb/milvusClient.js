/**
 * milvusClient.js
 * Flow 4：Milvus 向量数据库客户端
 *
 * 依赖（后续需安装）：
 * npm install @zilliz/milvus2-sdk-node
 *
 * 职责：
 *  - 初始化 collection（embeddings, dim=1536, metric=COSINE）
 *  - 插入向量
 *  - Top-K 搜索
 */

import { MilvusClient, DataType, MetricType, IndexType } from "@zilliz/milvus2-sdk-node";

const COLLECTION = "embeddings";
const DIM = 1536;
let client;

export async function init() {
  try {
    const address = process.env.MILVUS_URL || "localhost:19530";
    client = new MilvusClient({ address });
    console.debug("[Milvus] connecting to:", address);

    // Create collection if not exists
    const has = await client.hasCollection({ collection_name: COLLECTION });
    if (!has.value) {
      await client.createCollection({
        collection_name: COLLECTION,
        fields: [
          { name: "id", data_type: DataType.Int64, is_primary_key: true, autoID: true },
          { name: "doc_id", data_type: DataType.Int64 },
          { name: "paragraph_index", data_type: DataType.Int64 },
          { name: "content", data_type: DataType.VarChar, max_length: 2048 },
          { name: "embedding", data_type: DataType.FloatVector, dim: DIM },
        ],
      });
      await client.createIndex({
        collection_name: COLLECTION,
        field_name: "embedding",
        index_name: "idx_embedding",
        index_type: IndexType.IVF_FLAT,
        metric_type: MetricType.COSINE,
        params: { nlist: 1024 },
      });
      await client.loadCollectionSync({ collection_name: COLLECTION });
    } else {
      await client.loadCollectionSync({ collection_name: COLLECTION });
    }
    console.debug("[Milvus] init done");
  } catch (err) {
    console.error("[Milvus Error][init]", err);
    throw err;
  }
}

export async function insertEmbedding({ doc_id, paragraph_index, content, embedding }) {
  try {
    const rows = [{ doc_id, paragraph_index, content, embedding }];
    await client.insert({
      collection_name: COLLECTION,
      fields_data: rows,
    });
    return { success: true };
  } catch (err) {
    console.error("[Milvus Error][insert]", err);
    return { success: false, error: err.message };
  }
}

export async function search(queryEmbedding, top_k = 5) {
  try {
    const res = await client.search({
      collection_name: COLLECTION,
      anns_field: "embedding",
      metric_type: MetricType.COSINE,
      params: { nprobe: 16 },
      topk: top_k,
      vectors: [queryEmbedding],
      output_fields: ["doc_id", "paragraph_index", "content"],
    });
    const hits = res?.results?.[0] || [];
    const results = hits.map((h) => ({
      doc_id: Number(h.doc_id),
      paragraph_index: Number(h.paragraph_index),
      content: h.content,
      score: Number(h.score),
    }));
    return results;
  } catch (err) {
    console.error("[Milvus Error][search]", err);
    return [];
  }
}

