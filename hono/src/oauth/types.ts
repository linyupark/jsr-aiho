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
 */
export interface GitHubEmail {
  /** 邮箱地址 */
  email: string
  /** 是否为主要邮箱 */
  primary: boolean
  /** 是否已验证 */
  verified: boolean
  /** 可见性设置 */
  visibility: string | null
}

/**
 * GitHub OAuth 重定向 URL 服务函数类型
 */
export type GetGithubRedirectUrlService = (c: Context) => Response

/**
 * GitHub OAuth 回调处理服务函数类型
 */
export type HandleGithubCallbackService = (c: Context) => Promise<Response>

/**
 * Google OAuth 重定向 URL 服务函数类型
 */
export type GetGoogleRedirectUrlService = (c: Context) => Response

/**
 * Google OAuth 回调处理服务函数类型
 */
export type HandleGoogleCallbackService = (c: Context) => Promise<Response>
