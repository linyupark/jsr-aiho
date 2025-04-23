/**
 * OAuth 服务索引模块，集中导出所有 OAuth 服务。
 * 该模块导出 GitHub 和 Google OAuth 服务，便于统一导入和使用。
 *
 * @example
 * ```ts
 * import { github, google } from "@aiho/hono/oauth/services";
 *
 * // 使用 GitHub OAuth 服务
 * app.get("/auth/github", (c) => github.getGithubRedirectUrl(c));
 * app.get("/auth/github/callback", (c) => github.handleGithubCallback(c));
 *
 * // 使用 Google OAuth 服务
 * app.get("/auth/google", (c) => google.getGoogleRedirectUrl(c));
 * app.get("/auth/google/callback", (c) => google.handleGoogleCallback(c));
 * ```
 *
 * @module
 */

export * from './github.ts'
export * from './google.ts'
