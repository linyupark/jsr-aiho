import type { Context } from 'hono'

// 重新导出 Hono Context 类型
export type { Context }

// 导出 JWT 相关类型
export type { JWTPayload, Variables, JWTConfig, JWTService } from './jwt.ts'

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
 * HelloWorld 服务函数类型
 */
export type HelloWorldService = (c: Context) => Response | Promise<Response>

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
