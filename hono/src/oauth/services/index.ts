/**
 * OAuth 服务索引模块，集中导出所有 OAuth 服务。
 * 该模块导出 GitHub 和 Google OAuth 服务，便于统一导入和使用。
 * 通过这个模块，可以简化对多个 OAuth 服务的导入和管理。
 *
 * @example
 * ```ts
 * import { Hono } from "hono";
 * import { getGithubRedirectUrl, handleGithubCallback, getGoogleRedirectUrl, handleGoogleCallback } from "@aiho/hono/oauth/services";
 *
 * const app = new Hono();
 *
 * // 使用 GitHub OAuth 服务
 * app.get("/auth/github", (c) => getGithubRedirectUrl(c));
 * app.get("/auth/github/callback", async (c) => {
 *   const userInfo = await handleGithubCallback(c);
 *   return c.json(userInfo);
 * });
 *
 * // 使用 Google OAuth 服务
 * app.get("/auth/google", (c) => getGoogleRedirectUrl(c));
 * app.get("/auth/google/callback", async (c) => {
 *   const userInfo = await handleGoogleCallback(c);
 *   return c.json(userInfo);
 * });
 * ```
 *
 * @module
 */

export * from './github.ts'
export * from './google.ts'
