/**
 * 上传服务索引模块，集中导出所有上传相关功能。
 * 该模块导出上传服务和类型，便于统一导入和使用。
 * 通过这个模块，可以简化文件上传功能的实现和管理。
 *
 * @example
 * ```ts
 * import { Hono } from "hono";
 * import { createUploadService, type UploadConfig, type UploadResult } from "@aiho/hono/upload";
 *
 * const app = new Hono();
 *
 * // 创建上传服务
 * const uploadService = createUploadService({
 *   allowedTypes: ["image/jpeg", "image/png"],
 *   maxSize: 2 * 1024 * 1024, // 2MB
 *   uploadDir: "images"
 * });
 *
 * // 添加上传路由
 * app.post("/upload", async (c) => {
 *   return await uploadService.handleUpload(c);
 * });
 * ```
 *
 * @module
 */

export { createUploadService } from './services.ts'
export type { UploadConfig, UploadResult, UploadService } from './types.ts'
