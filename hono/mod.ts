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
