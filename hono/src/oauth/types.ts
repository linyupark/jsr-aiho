/**
 * OAuth 类型模块，定义了与 OAuth 认证相关的类型和接口。
 * 该模块包含 GitHub 和 Google OAuth 服务的类型定义。
 *
 * @example
 * ```ts
 * import type { GitHubEmail, GetGithubRedirectUrlService } from "@aiho/hono/oauth/types";
 *
 * // 使用 GitHub 邮箱类型
 * const email: GitHubEmail = {
 *   email: "user@example.com",
 *   primary: true,
 *   verified: true,
 *   visibility: "public"
 * };
 *
 * // 使用 OAuth 服务类型
 * const getRedirectUrl: GetGithubRedirectUrlService = (c) => {
 *   // 实现重定向逻辑
 *   return c.redirect("https://github.com/login/oauth/authorize?...");
 * };
 * ```
 *
 * @module
 */

import type { Context } from 'hono'

/**
 * GitHub 用户邮箱信息接口
 *
 * 该接口定义了从 GitHub API 获取的用户邮箱信息的结构。
 * GitHub 可能会返回用户的多个邮箱地址，通常我们会选择主要且已验证的邮箱。
 *
 * @see https://docs.github.com/en/rest/users/emails
 *
 * @example
 * ```ts
 * import type { GitHubEmail } from "@aiho/hono/oauth/types";
 *
 * // 处理 GitHub 返回的邮箱列表
 * function getPrimaryEmail(emails: GitHubEmail[]): string | null {
 *   const primaryEmail = emails.find(email => email.primary && email.verified);
 *   return primaryEmail ? primaryEmail.email : null;
 * }
 * ```
 */
export interface GitHubEmail {
  /**
   * 邮箱地址，例如 "user@example.com"
   */
  email: string
  /**
   * 是否为主要邮箱，GitHub 账户可以有多个邮箱，但只有一个是主要邮箱
   */
  primary: boolean
  /**
   * 是否已验证，只有已验证的邮箱才能用于接收通知等功能
   */
  verified: boolean
  /**
   * 可见性设置，可能的值包括 "public"、"private" 或 null
   * - "public": 邮箱对其他 GitHub 用户可见
   * - "private": 邮箱对其他 GitHub 用户不可见
   * - null: 未设置可见性
   */
  visibility: string | null
}

/**
 * GitHub OAuth 重定向 URL 服务函数类型
 *
 * 该类型定义了生成 GitHub OAuth 授权 URL 并将用户重定向到该 URL 的函数。
 * 函数接收 Hono 上下文对象，返回重定向响应。
 *
 * @example
 * ```ts
 * import type { GetGithubRedirectUrlService } from "@aiho/hono/oauth/types";
 * import { createState } from "@aiho/hono/state";
 *
 * // 自定义 GitHub 重定向 URL 服务
 * const customGithubRedirectService: GetGithubRedirectUrlService = (c) => {
 *   const clientId = "your-github-client-id";
 *   const redirectUri = "https://your-app.com/auth/github/callback";
 *   const state = createState({ from: c.req.query("from") || "/" });
 *
 *   const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
 *   return c.redirect(url);
 * };
 * ```
 */
export type GetGithubRedirectUrlService = (c: Context) => Response

/**
 * GitHub OAuth 回调处理服务函数类型
 *
 * 该类型定义了处理 GitHub OAuth 回调的函数。
 * 函数接收 Hono 上下文对象（包含授权码和状态），
 * 使用授权码获取访问令牌和用户信息，然后返回包含用户信息的响应。
 *
 * @example
 * ```ts
 * import type { HandleGithubCallbackService } from "@aiho/hono/oauth/types";
 * import { getStateData, deleteStateData } from "@aiho/hono/state";
 *
 * // 自定义 GitHub 回调处理服务
 * const customGithubCallbackService: HandleGithubCallbackService = async (c) => {
 *   const code = c.req.query("code");
 *   const state = c.req.query("state");
 *
 *   if (!code) {
 *     return c.json({ error: "授权码缺失" }, 400);
 *   }
 *
 *   // 验证状态并获取关联数据
 *   const stateData = getStateData(state);
 *   if (!stateData) {
 *     return c.json({ error: "无效的状态" }, 400);
 *   }
 *
 *   // 处理授权码，获取用户信息...
 *
 *   // 清理状态
 *   deleteStateData(state);
 *
 *   // 返回用户信息或设置会话
 *   return c.json({ user: userInfo, redirectTo: stateData.from });
 * };
 * ```
 */
export type HandleGithubCallbackService = (c: Context) => Promise<Response>

/**
 * Google OAuth 重定向 URL 服务函数类型
 *
 * 该类型定义了生成 Google OAuth 授权 URL 并将用户重定向到该 URL 的函数。
 * 函数接收 Hono 上下文对象，返回重定向响应。
 *
 * @example
 * ```ts
 * import type { GetGoogleRedirectUrlService } from "@aiho/hono/oauth/types";
 * import { createState } from "@aiho/hono/state";
 *
 * // 自定义 Google 重定向 URL 服务
 * const customGoogleRedirectService: GetGoogleRedirectUrlService = (c) => {
 *   const clientId = "your-google-client-id";
 *   const redirectUri = "https://your-app.com/auth/google/callback";
 *   const state = createState({ from: c.req.query("from") || "/" });
 *
 *   const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid email profile&state=${state}`;
 *   return c.redirect(url);
 * };
 * ```
 */
export type GetGoogleRedirectUrlService = (c: Context) => Response

/**
 * Google OAuth 回调处理服务函数类型
 *
 * 该类型定义了处理 Google OAuth 回调的函数。
 * 函数接收 Hono 上下文对象（包含授权码和状态），
 * 使用授权码获取访问令牌和用户信息，然后返回包含用户信息的响应。
 *
 * @example
 * ```ts
 * import type { HandleGoogleCallbackService } from "@aiho/hono/oauth/types";
 * import { getStateData, deleteStateData } from "@aiho/hono/state";
 *
 * // 自定义 Google 回调处理服务
 * const customGoogleCallbackService: HandleGoogleCallbackService = async (c) => {
 *   const code = c.req.query("code");
 *   const state = c.req.query("state");
 *
 *   if (!code) {
 *     return c.json({ error: "授权码缺失" }, 400);
 *   }
 *
 *   // 验证状态并获取关联数据
 *   const stateData = getStateData(state);
 *   if (!stateData) {
 *     return c.json({ error: "无效的状态" }, 400);
 *   }
 *
 *   // 处理授权码，获取用户信息...
 *
 *   // 清理状态
 *   deleteStateData(state);
 *
 *   // 返回用户信息或设置会话
 *   return c.json({ user: userInfo, redirectTo: stateData.from });
 * };
 * ```
 */
export type HandleGoogleCallbackService = (c: Context) => Promise<Response>
