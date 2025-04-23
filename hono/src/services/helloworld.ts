/**
 * Hello World 模块，提供了一个简单的示例服务。
 * 该模块主要用于演示和测试目的。
 *
 * @example
 * ```ts
 * import { Hono } from "hono";
 * import { helloWorld } from "@aiho/hono";
 *
 * const app = new Hono();
 *
 * // 添加 Hello World 路由
 * app.get("/hello", helloWorld);
 * ```
 *
 * @module
 */

import type { Context } from 'hono'

/**
 * 返回一个简单的 Hello World 消息
 * @param c Hono 上下文
 * @returns JSON 响应，包含 Hello World 消息
 */
export const helloWorld = (c: Context): Response => {
  return c.json({
    message: 'Hello World!'
  })
}
