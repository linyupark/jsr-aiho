/**
 * 上传服务类型模块，定义了与文件上传相关的类型和接口。
 * 该模块包含上传配置、上传结果和上传服务接口的类型定义。
 *
 * @example
 * ```ts
 * import type { UploadConfig, UploadResult } from "@aiho/hono/upload/types";
 *
 * // 使用上传配置类型
 * const config: UploadConfig = {
 *   maxSize: 5 * 1024 * 1024, // 5MB
 *   allowedTypes: ["image/jpeg", "image/png"],
 *   uploadDir: "images"
 * };
 * ```
 *
 * @module
 */

import type { Context } from 'hono'

/**
 * 上传配置接口
 */
export interface UploadConfig {
  /**
   * 允许的文件类型（MIME类型）
   * @example ["image/jpeg", "image/png", "image/gif"]
   */
  allowedTypes: string[] | RegExp

  /**
   * 最大文件大小（字节）
   * @example 2 * 1024 * 1024 // 2MB
   */
  maxSize: number

  /**
   * 上传目录名称（相对于基础上传目录）
   * @example "avatars"
   */
  uploadDir: string

  /**
   * 文件名生成函数
   * @param file 上传的文件
   * @param c Hono上下文
   * @returns 生成的文件名
   */
  generateFileName?: (file: File, c: Context) => string

  /**
   * 基础上传目录（绝对路径）
   * 默认为 process.cwd() + "/public/uploads"
   */
  baseUploadDir?: string

  /**
   * 文件URL前缀
   * 默认为 "/api/uploads"
   */
  urlPrefix?: string
}

/**
 * 上传结果接口
 */
export interface UploadResult {
  /**
   * 上传后的文件URL
   */
  url: string

  /**
   * 文件名
   */
  fileName: string

  /**
   * 文件大小（字节）
   */
  size: number

  /**
   * 文件类型（MIME类型）
   */
  type: string
}

/**
 * 上传服务接口
 */
export interface UploadService {
  /**
   * 处理文件上传
   * @param c Hono上下文
   * @param formFieldName 表单字段名称，默认为"file"
   * @returns 上传结果
   */
  handleUpload(c: Context, formFieldName?: string): Promise<Response>
}
