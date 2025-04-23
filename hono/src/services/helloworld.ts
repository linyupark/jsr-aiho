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
