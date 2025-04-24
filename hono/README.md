# @aiho/hono

一个基于 [Hono](https://hono.dev/) 框架的实用工具集，提供 OAuth、JWT 和其他实用功能。该库旨在简化 Hono 应用程序中的身份验证、授权和文件上传功能的实现。

该库为 Deno 和 Hono 项目提供了类型安全、易于使用的 API，可以快速集成到现有项目中。

## 功能

- **OAuth 认证**：支持 GitHub 和 Google 等第三方登录
- **JWT 认证和授权**：简化的 JWT 令牌生成、验证和中间件
- **状态管理**：安全的 OAuth 状态管理机制
- **文件上传服务**：支持多种文件类型的上传、验证和存储

## 主要模块

- `@aiho/hono/jwt`：JWT 服务和中间件
- `@aiho/hono/oauth`：OAuth 认证服务（GitHub、Google）
- `@aiho/hono/state`：状态管理服务
- `@aiho/hono/upload`：文件上传服务

每个主要模块还提供了更细粒度的导入路径，例如：

- `@aiho/hono/jwt/middleware`：JWT 中间件
- `@aiho/hono/jwt/services`：JWT 服务
- `@aiho/hono/oauth/services/github`：GitHub OAuth 集成
- `@aiho/hono/oauth/services/google`：Google OAuth 集成

## 环境变量

使用 OAuth 功能需要设置以下环境变量：

### GitHub OAuth

- `GITHUB_CLIENT_ID`: GitHub OAuth 应用的客户端 ID
- `GITHUB_CLIENT_SECRET`: GitHub OAuth 应用的客户端密钥
- `GITHUB_REDIRECT_URI`: GitHub OAuth 回调 URL

### Google OAuth

- `GOOGLE_CLIENT_ID`: Google OAuth 应用的客户端 ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth 应用的客户端密钥
- `GOOGLE_REDIRECT_URI`: Google OAuth 回调 URL

## 许可证

MIT

## API 文档

每个模块都提供了详细的 JSDoc 文档注释，可以在编辑器中查看

## 更新日志 (CHANGELOG)

查看完整的[更新日志](./hono/CHANGELOG.md)了解所有版本的变更详情。
