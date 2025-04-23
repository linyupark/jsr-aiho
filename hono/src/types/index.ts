import type { Context } from 'hono'

// 重新导出 Hono Context 类型
export type { Context }

// 导出 JWT 相关类型
export type { JWTPayload, Variables, JWTConfig, JWTService } from './jwt.ts'

// HelloWorld 服务函数类型
export type HelloWorldService = (c: Context) => Response | Promise<Response>

// GitHub OAuth 服务函数类型
export type GetGithubRedirectUrlService = (c: Context) => Response
export type HandleGithubCallbackService = (c: Context) => Promise<Response>

// Google OAuth 服务函数类型
export type GetGoogleRedirectUrlService = (c: Context) => Response
export type HandleGoogleCallbackService = (c: Context) => Promise<Response>
