/**
 * 上传服务模块，提供文件上传的核心功能。
 * 该模块实现了 UploadService 接口，提供了一个通用的文件上传服务。
 *
 * @example
 * ```ts
 * import { Hono } from "hono";
 * import { createUploadService } from "@aiho/hono/upload";
 *
 * const app = new Hono();
 *
 * // 创建头像上传服务
 * const avatarUploadService = createUploadService({
 *   allowedTypes: /image\/(jpeg|jpg|png|gif|webp)/,
 *   maxSize: 2 * 1024 * 1024, // 2MB
 *   uploadDir: "avatars"
 * });
 *
 * // 使用上传服务
 * app.post("/upload/avatar", (c) => avatarUploadService.handleUpload(c));
 * ```
 *
 * @module
 */

import { join } from 'path'
import { ensureDir } from './utils.ts'
import type { Context } from 'hono'
import type { UploadConfig, UploadResult, UploadService } from './types.ts'

/**
 * 默认文件名生成函数
 * @param file 上传的文件
 * @param c Hono上下文
 * @returns 生成的文件名
 */
const defaultGenerateFileName = (file: File, c: Context): string => {
  // 获取用户ID（如果有JWT中间件）
  let userId = 'anonymous'
  try {
    const jwtPayload = c.get('jwtPayload')
    if (jwtPayload && jwtPayload.uuid) {
      userId = jwtPayload.uuid
    } else if (jwtPayload && jwtPayload.userId) {
      userId = jwtPayload.userId
    } else if (jwtPayload && jwtPayload.id) {
      userId = jwtPayload.id
    }
  } catch (_) {
    // 如果没有JWT中间件或获取失败，使用默认值
  }

  // 创建唯一文件名
  const fileExt = file.name.split('.').pop() || ''
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substring(2, 10)
  return `${userId}-${timestamp}-${randomStr}.${fileExt}`
}

/**
 * 默认上传配置
 */
const defaultConfig: Partial<UploadConfig> = {
  baseUploadDir: Deno.cwd() + '/public/uploads',
  urlPrefix: '/api/uploads',
  generateFileName: defaultGenerateFileName
}

/**
 * 创建上传服务
 * 该函数创建一个文件上传服务实例，可用于处理文件上传请求
 * 服务实例将根据提供的配置进行文件类型验证、大小验证和存储
 *
 * @param config 上传配置，包含允许的文件类型、最大文件大小和上传目录等
 * @returns 上传服务实例，包含 handleUpload 方法
 *
 * @example
 * ```ts
 * import { Hono } from "hono";
 * import { createUploadService } from "@aiho/hono/upload";
 *
 * const app = new Hono();
 *
 * // 创建头像上传服务
 * const avatarUploadService = createUploadService({
 *   allowedTypes: ["image/jpeg", "image/png", "image/gif"],
 *   maxSize: 2 * 1024 * 1024, // 2MB
 *   uploadDir: "avatars"
 * });
 *
 * // 添加上传路由
 * app.post("/upload/avatar", (c) => avatarUploadService.handleUpload(c));
 * ```
 */
export const createUploadService = (config: UploadConfig): UploadService => {
  // 合并默认配置
  const finalConfig: UploadConfig = {
    ...defaultConfig,
    ...config
  }

  return {
    /**
     * 处理文件上传
     * @param c Hono上下文
     * @param formFieldName 表单字段名称，默认为"file"
     * @returns 上传结果
     */
    async handleUpload(c: Context, formFieldName = 'file'): Promise<Response> {
      try {
        // 解析表单数据
        const formData = await c.req.formData()
        const file = formData.get(formFieldName) as File

        // 验证文件是否存在
        if (!file) {
          return c.json({ error: '未提供文件' }, 400)
        }

        // 验证文件类型
        const isValidType =
          finalConfig.allowedTypes instanceof RegExp
            ? finalConfig.allowedTypes.test(file.type)
            : finalConfig.allowedTypes.includes(file.type)

        if (!isValidType) {
          return c.json({ error: '不支持的文件类型' }, 400)
        }

        // 验证文件大小
        if (file.size > finalConfig.maxSize) {
          const maxSizeMB = finalConfig.maxSize / (1024 * 1024)
          return c.json({ error: `文件大小不能超过 ${maxSizeMB} MB` }, 400)
        }

        // 确保上传目录存在
        const uploadDir = join(
          finalConfig.baseUploadDir as string,
          finalConfig.uploadDir
        )
        await ensureDir(uploadDir)

        // 生成文件名
        const fileName = finalConfig.generateFileName
          ? finalConfig.generateFileName(file, c)
          : defaultGenerateFileName(file, c)

        // 读取文件内容
        const bytes = await file.arrayBuffer()
        const buffer = new Uint8Array(bytes)

        // 写入文件
        const filePath = join(uploadDir, fileName)
        await Deno.writeFile(filePath, buffer)

        // 构建文件URL
        const fileUrl = `${finalConfig.urlPrefix}/${finalConfig.uploadDir}/${fileName}`

        // 构建上传结果
        const result: UploadResult = {
          url: fileUrl,
          fileName,
          size: file.size,
          type: file.type
        }

        return c.json(result)
      } catch (error) {
        console.error('上传文件失败:', error)
        return c.json({ error: '上传文件失败' }, 500)
      }
    }
  }
}
