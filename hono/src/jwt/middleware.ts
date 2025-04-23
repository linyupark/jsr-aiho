/**
 * JWT 中间件模块，提供了基于 JWT 的认证中间件。
 * 该模块允许在 Hono 应用中轻松实现基于 JWT 的路由保护。
 *
 * @example
 * ```ts
 * import { Hono } from "hono";
 * import { DefaultJWTService } from "@aiho/hono/jwt";
 * import { createJWTMiddleware } from "@aiho/hono/jwt/middleware";
 *
 * const app = new Hono();
 *
 * // 创建 JWT 服务
 * const jwtService = new DefaultJWTService({
 *   secret: "your-secret-key",
 *   validityPeriod: 60 * 60 * 24 * 7, // 7 天
 * });
 *
 * // 创建 JWT 中间件
 * const jwtMiddleware = createJWTMiddleware(jwtService.verify.bind(jwtService));
 *
 * // 保护的路由
 * app.get("/protected", jwtMiddleware, (c) => {
 *   const payload = c.get("jwtPayload");
 *   return c.json({ message: "Protected route", user: payload });
 * });
 * ```
 *
 * @module
 */

import type { Context, Next } from 'hono'
import type { JWTPayload, Variables } from './types.ts'

/**
 * 创建 JWT 验证中间件
 * @param verifyFn JWT 验证函数，用于验证令牌并返回负载数据
 * @returns Hono 中间件函数，用于验证请求中的 JWT 令牌
 */
export const createJWTMiddleware = (
  verifyFn: (token: string) => Promise<JWTPayload>
): ((
  c: Context<{ Variables: Variables }>,
  next: Next
) => Promise<Response | void>) => {
  return async (c: Context<{ Variables: Variables }>, next: Next) => {
    const token = c.req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return c.json({ error: '未提供认证令牌' }, 401)
    }

    try {
      const payload = await verifyFn(token)
      c.set('jwtPayload', payload)
      await next()
    } catch (_) {
      return c.json({ error: '无效的认证令牌' }, 401)
    }
  }
}
