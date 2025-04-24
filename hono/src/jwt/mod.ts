/**
 * JWT 模块，提供 JWT 令牌的生成、验证和管理功能。
 * 该模块导出 JWT 服务和中间件，便于统一导入和使用。
 *
 * @example
 * ```ts
 * import { Hono } from "hono";
 * import { DefaultJWTService, createJWTMiddleware } from "@aiho/hono/jwt";
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

export { DefaultJWTService } from './services.ts'
export { createJWTMiddleware } from './middleware.ts'
export type { JWTPayload, Variables, JWTConfig, JWTService } from './types.ts'
