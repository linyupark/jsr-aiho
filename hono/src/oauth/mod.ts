/**
 * OAuth 模块，提供了与第三方 OAuth 认证集成的功能。
 * 该模块导出 GitHub 和 Google OAuth 服务，便于统一导入和使用。
 *
 * @example
 * ```ts
 * import { Hono } from "hono";
 * import { getGithubRedirectUrl, handleGithubCallback, getGoogleRedirectUrl, handleGoogleCallback } from "@aiho/hono/oauth";
 *
 * const app = new Hono();
 *
 * // GitHub OAuth 路由
 * app.get("/auth/github", (c) => getGithubRedirectUrl(c));
 * app.get("/auth/github/callback", async (c) => {
 *   const userInfo = await handleGithubCallback(c);
 *   return c.json(userInfo);
 * });
 *
 * // Google OAuth 路由
 * app.get("/auth/google", (c) => getGoogleRedirectUrl(c));
 * app.get("/auth/google/callback", async (c) => {
 *   const userInfo = await handleGoogleCallback(c);
 *   return c.json(userInfo);
 * });
 * ```
 *
 * @module
 */

export {
  getGithubRedirectUrl,
  handleGithubCallback
} from './services/github.ts'

export {
  getGoogleRedirectUrl,
  handleGoogleCallback
} from './services/google.ts'

export type {
  GitHubEmail,
  GetGithubRedirectUrlService,
  HandleGithubCallbackService,
  GetGoogleRedirectUrlService,
  HandleGoogleCallbackService
} from './types.ts'
