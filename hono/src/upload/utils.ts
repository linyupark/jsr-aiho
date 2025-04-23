/**
 * 上传工具模块，提供文件上传相关的工具函数。
 * 该模块包含目录创建等辅助功能。
 *
 * @module
 */

/**
 * 确保目录存在，如果不存在则创建
 * @param dir 目录路径
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
