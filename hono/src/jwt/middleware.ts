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
 * 该函数创建一个 Hono 中间件，用于验证请求中的 JWT 令牌
 * 中间件会从 Authorization 头部提取 Bearer 令牌，验证其有效性，
 * 并将令牌负载数据存储在上下文中
 *
 * @param verifyFn JWT 验证函数，用于验证令牌并返回负载数据。通常是 JWTService.verify 方法的绑定版本。
 * 该函数应接收一个字符串类型的令牌，并返回一个包含解码后负载数据的 Promise。
 * 如果令牌无效或已过期，该函数应抛出异常。
 *
 * @returns Hono 中间件函数，用于验证请求中的 JWT 令牌。
 * 该中间件会检查请求头中的 Authorization 字段，提取 Bearer 令牌，
 * 验证令牌有效性，并将解码后的负载数据存储在上下文的 'jwtPayload' 变量中。
 * 如果令牌缺失或无效，中间件会返回 401 错误响应。
 *
 * @example 基本用法
 * ```ts
 * import { Hono } from "hono";
 * import { DefaultJWTService } from "@aiho/hono/jwt";
 * import { createJWTMiddleware } from "@aiho/hono/jwt/middleware";
 *
 * const app = new Hono();
 *
 * // 创建 JWT 服务
 * const jwtService = new DefaultJWTService({
 *   secret: "your-secret-key"
 * });
 *
 * // 创建 JWT 中间件
 * const jwtMiddleware = createJWTMiddleware(jwtService.verify.bind(jwtService));
 *
 * // 使用中间件保护路由
 * app.get("/protected", jwtMiddleware, (c) => {
 *   const payload = c.get("jwtPayload");
 *   return c.json({ message: "Protected route", user: payload });
 * });
 * ```
 *
 * @example 错误处理
 * ```ts
 * import { Hono } from "hono";
 * import { DefaultJWTService } from "@aiho/hono/jwt";
 * import { createJWTMiddleware } from "@aiho/hono/jwt/middleware";
 *
 * const app = new Hono();
 * const jwtService = new DefaultJWTService({ secret: "your-secret-key" });
 * const jwtMiddleware = createJWTMiddleware(jwtService.verify.bind(jwtService));
 *
 * // 自定义错误处理
 * app.use("/api/*", async (c, next) => {
 *   try {
 *     await next();
 *   } catch (error) {
 *     if (error.message === "无效的认证令牌") {
 *       return c.json({ error: "认证失败，请重新登录", code: "AUTH_FAILED" }, 401);
 *     }
 *     throw error; // 重新抛出其他错误
 *   }
 * });
 *
 * // 使用中间件保护 API 路由
 * app.get("/api/user", jwtMiddleware, (c) => {
 *   const { userId, role } = c.get("jwtPayload");
 *   // 根据用户 ID 获取用户信息
 *   return c.json({ userId, role });
 * });
 * ```
 *
 * @example 与其他中间件组合使用
 * ```ts
 * import { Hono } from "hono";
 * import { DefaultJWTService } from "@aiho/hono/jwt";
 * import { createJWTMiddleware } from "@aiho/hono/jwt/middleware";
 * import { logger } from "hono/logger";
 *
 * const app = new Hono();
 * app.use("*", logger());
 *
 * const jwtService = new DefaultJWTService({ secret: "your-secret-key" });
 * const jwtMiddleware = createJWTMiddleware(jwtService.verify.bind(jwtService));
 *
 * // 创建角色验证中间件
 * const roleMiddleware = (requiredRole: string) => {
 *   return async (c, next) => {
 *     const payload = c.get("jwtPayload");
 *     if (payload.role !== requiredRole) {
 *       return c.json({ error: "权限不足" }, 403);
 *     }
 *     await next();
 *   };
 * };
 *
 * // 组合中间件使用
 * app.get("/admin", jwtMiddleware, roleMiddleware("admin"), (c) => {
 *   return c.json({ message: "管理员页面" });
 * });
 * ```
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
