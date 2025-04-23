/**
 * @aiho/hono 是一个基于 Hono 框架的实用工具集，提供 OAuth、JWT 和其他实用功能。
 * 该模块导出所有主要功能，包括 OAuth 认证、JWT 认证和授权、状态管理等。
 *
 * @example
 * ```ts
 * // 使用 GitHub OAuth
 * import { getGithubRedirectUrl, handleGithubCallback } from "@aiho/hono";
 *
 * const app = new Hono();
 * app.get("/auth/github", (c) => getGithubRedirectUrl(c));
 * app.get("/auth/github/callback", (c) => handleGithubCallback(c));
 * ```
 *
 * @example
 * ```ts
 * // 使用 JWT 认证
 * import { DefaultJWTService, createJWTMiddleware } from "@aiho/hono";
 *
 * const jwtService = new DefaultJWTService({ secret: "your-secret" });
 * const jwtMiddleware = createJWTMiddleware(jwtService.verify.bind(jwtService));
 *
 * app.get("/protected", jwtMiddleware, (c) => c.json({ message: "Protected route" }));
 * ```
 *
 * @module
 */

// 导出类型
export type {
  // Hono Context 类型
  Context,
  // 服务函数类型
  HelloWorldService,
  // GitHub OAuth 服务函数类型
  GetGithubRedirectUrlService,
  HandleGithubCallbackService,
  // Google OAuth 服务函数类型
  GetGoogleRedirectUrlService,
  HandleGoogleCallbackService,
  // JWT 类型
  JWTPayload,
  Variables,
  JWTConfig,
  JWTService
} from './src/types/index.ts'

// 导出 JWT 相关
export { DefaultJWTService } from './src/services/jwt.ts'
export { createJWTMiddleware } from './src/middleware/jwt.ts'

// 导出 OAuth 相关
export {
  getGithubRedirectUrl,
  handleGithubCallback
} from './src/services/oauth_github.ts'
export {
  getGoogleRedirectUrl,
  handleGoogleCallback
} from './src/services/oauth_google.ts'

// 导出状态管理
export {
  createState,
  getStateData,
  deleteStateData,
  clearExpiredStateData
} from './src/services/state_manager.ts'

// 导出 Hello World 示例
export { helloWorld } from './src/services/helloworld.ts'
