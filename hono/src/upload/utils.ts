/**
 * 上传工具模块，提供文件上传相关的工具函数。
 * 该模块包含目录创建等辅助功能。
 *
 * @module
 */

/**
 * 确保目录存在，如果不存在则创建
 * 该函数会递归创建目录，如果目录已存在则不会报错
 *
 * @param dir 目录路径
 * @returns Promise<void> 创建成功后的 Promise
 * @throws 如果创建目录失败（目录已存在除外）
 *
 * @example
 * ```ts
 * import { ensureDir } from "@aiho/hono/upload/utils";
 *
 * // 确保上传目录存在
 * await ensureDir("/path/to/uploads");
 * ```
 */
export async function ensureDir(dir: string): Promise<void> {
  try {
    await Deno.mkdir(dir, { recursive: true })
  } catch (error) {
    // 如果目录已存在，忽略错误
    if (!(error instanceof Deno.errors.AlreadyExists)) {
      throw error
    }
  }
}
