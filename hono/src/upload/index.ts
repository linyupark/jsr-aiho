/**
 * 上传服务索引模块，集中导出所有上传相关功能。
 * 该模块导出上传服务和类型，便于统一导入和使用。
 *
 * @example
 * ```ts
 * import { createUploadService, type UploadConfig } from "@aiho/hono/upload";
 *
 * // 创建上传服务
 * const uploadService = createUploadService({
 *   allowedTypes: ["image/jpeg", "image/png"],
 *   maxSize: 2 * 1024 * 1024, // 2MB
 *   uploadDir: "images"
 * });
 * ```
 *
 * @module
 */

export { createUploadService } from './services.ts'
export type { UploadConfig, UploadResult, UploadService } from './types.ts'
