/**
 * 上传工具模块，提供文件上传相关的工具函数。
 * 该模块包含目录创建等辅助功能。
 *
 * @module
 */

/**
 * 确保目录存在，如果不存在则创建
 * 该函数会递归创建目录，如果目录已存在则不会报错
 * 这是一个实用工具函数，可用于在文件上传前确保目标目录存在
 *
 * @param dir 目录路径，可以是相对路径或绝对路径
 * @returns Promise<void> 创建成功后的 Promise
 * @throws 如果创建目录失败（目录已存在除外），例如权限不足或磁盘空间不足
 *
 * @example 基本用法
 * ```ts
 * import { ensureDir } from "@aiho/hono/upload/utils";
 *
 * // 确保上传目录存在
 * await ensureDir("/path/to/uploads");
 * ```
 *
 * @example 与文件上传服务一起使用
 * ```ts
 * import { Hono } from "hono";
 * import { ensureDir } from "@aiho/hono/upload/utils";
 * import { join } from "path";
 *
 * const app = new Hono();
 *
 * // 自定义文件上传处理
 * app.post("/upload", async (c) => {
 *   const formData = await c.req.formData();
 *   const file = formData.get("file") as File;
 *
 *   if (!file) {
 *     return c.json({ error: "未提供文件" }, 400);
 *   }
 *
 *   // 确保上传目录存在
 *   const uploadDir = join(Deno.cwd(), "public/uploads");
 *   await ensureDir(uploadDir);
 *
 *   // 生成文件名并保存文件
 *   const fileName = `${Date.now()}-${file.name}`;
 *   const filePath = join(uploadDir, fileName);
 *
 *   const bytes = await file.arrayBuffer();
 *   await Deno.writeFile(filePath, new Uint8Array(bytes));
 *
 *   return c.json({
 *     success: true,
 *     url: `/uploads/${fileName}`
 *   });
 * });
 * ```
 *
 * @example 创建嵌套目录
 * ```ts
 * import { ensureDir } from "@aiho/hono/upload/utils";
 * import { join } from "path";
 *
 * // 创建用户特定的上传目录
 * async function createUserUploadDir(userId: string): Promise<string> {
 *   const baseDir = join(Deno.cwd(), "uploads");
 *   const userDir = join(baseDir, userId);
 *
 *   // 递归创建嵌套目录
 *   await ensureDir(userDir);
 *
 *   // 创建子目录
 *   const imagesDir = join(userDir, "images");
 *   const documentsDir = join(userDir, "documents");
 *
 *   await Promise.all([
 *     ensureDir(imagesDir),
 *     ensureDir(documentsDir)
 *   ]);
 *
 *   return userDir;
 * }
 * ```
 *
 * @example 错误处理
 * ```ts
 * import { ensureDir } from "@aiho/hono/upload/utils";
 *
 * async function safeCreateDir(path: string): Promise<boolean> {
 *   try {
 *     await ensureDir(path);
 *     console.log(`目录已创建或已存在: ${path}`);
 *     return true;
 *   } catch (error) {
 *     console.error(`创建目录失败: ${path}`, error);
 *     // 可以根据错误类型进行不同处理
 *     if (error instanceof Deno.errors.PermissionDenied) {
 *       console.error("权限不足，请检查目录权限");
 *     }
 *     return false;
 *   }
 * }
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
