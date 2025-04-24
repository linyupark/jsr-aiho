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

/**
 * 从 GitHub OAuth 服务模块导出所有功能
 *
 * 包括：
 * - {@link getGithubRedirectUrl} - 获取 GitHub OAuth 重定向 URL
 * - {@link handleGithubCallback} - 处理 GitHub OAuth 回调
 *
 * @example
 * ```ts
 * import { getGithubRedirectUrl, handleGithubCallback } from "@aiho/hono/oauth/services";
 *
 * // 使用 GitHub OAuth 服务
 * app.get("/auth/github", (c) => getGithubRedirectUrl(c));
 * app.get("/auth/github/callback", (c) => handleGithubCallback(c));
 * ```
 */
export * from './github.ts'

/**
 * 从 Google OAuth 服务模块导出所有功能
 *
 * 包括：
 * - {@link getGoogleRedirectUrl} - 获取 Google OAuth 重定向 URL
 * - {@link handleGoogleCallback} - 处理 Google OAuth 回调
 *
 * @example
 * ```ts
 * import { getGoogleRedirectUrl, handleGoogleCallback } from "@aiho/hono/oauth/services";
 *
 * // 使用 Google OAuth 服务
 * app.get("/auth/google", (c) => getGoogleRedirectUrl(c));
 * app.get("/auth/google/callback", (c) => handleGoogleCallback(c));
 * ```
 */
export * from './google.ts'
