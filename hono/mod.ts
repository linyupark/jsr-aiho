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

import type { Context } from 'hono'

// 导出 Hono Context 类型
export type { Context }

// 导出 JWT 相关类型
export type {
  JWTPayload,
  Variables,
  JWTConfig,
  JWTService
} from './src/jwt/types.ts'

// 导出 OAuth 相关类型
export type {
  GitHubEmail,
  GetGithubRedirectUrlService,
  HandleGithubCallbackService,
  GetGoogleRedirectUrlService,
  HandleGoogleCallbackService
} from './src/oauth/types.ts'

// 导出 State 相关类型
export type { StateData } from './src/state/types.ts'

// 导出 Upload 相关类型
export type {
  UploadConfig,
  UploadResult,
  UploadService
} from './src/upload/types.ts'

// 导出 JWT 相关
export { DefaultJWTService } from './src/jwt/services.ts'
export { createJWTMiddleware } from './src/jwt/middleware.ts'

// 导出 OAuth 相关
export {
  getGithubRedirectUrl,
  handleGithubCallback
} from './src/oauth/services/github.ts'

export {
  getGoogleRedirectUrl,
  handleGoogleCallback
} from './src/oauth/services/google.ts'

// 导出状态管理
export {
  createState,
  getStateData,
  deleteStateData,
  clearExpiredStateData
} from './src/state/services.ts'

// 导出上传服务
export { createUploadService } from './src/upload/index.ts'
