# @aiho/hono

一个基于 Hono 框架的实用工具集，提供 OAuth、JWT 和其他实用功能。

## 功能

- OAuth 认证（GitHub 和 Google）
- JWT 认证和授权
- 状态管理

## 安装

### Deno

```ts
// 导入所有功能
import * as aihoHono from "jsr:@aiho/hono";

// 或者单独导入特定功能
import { getGithubRedirectUrl } from "jsr:@aiho/hono/oauth/github";
import { DefaultJWTService } from "jsr:@aiho/hono/jwt";
```

## 使用示例

### OAuth 认证

```ts
import { Hono } from "hono";
import { getGithubRedirectUrl, handleGithubCallback } from "jsr:@aiho/hono/oauth/github";

const app = new Hono();

// GitHub OAuth 路由
app.get("/auth/github", (c) => getGithubRedirectUrl(c));
app.get("/auth/github/callback", (c) => handleGithubCallback(c));

Deno.serve(app.fetch);
```

### JWT 认证

```ts
import { Hono } from "hono";
import { DefaultJWTService } from "jsr:@aiho/hono/jwt";
import { createJWTMiddleware } from "jsr:@aiho/hono/middleware";

const app = new Hono();

// 创建 JWT 服务
const jwtService = new DefaultJWTService({
  secret: "your-secret-key",
  validityPeriod: 60 * 60 * 24 * 7, // 7 天
});

// 创建 JWT 中间件
const jwtMiddleware = createJWTMiddleware(jwtService.verify.bind(jwtService));

// 保护的路由
app.get("/protected", jwtMiddleware, (c) => {
  const payload = c.get("jwtPayload");
  return c.json({ message: "Protected route", user: payload });
});

Deno.serve(app.fetch);
```

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

## 更新日志 (CHANGELOG)

### [0.1.2]

#### 🎉 首次发布

##### ✨ 新功能
- OAuth 认证支持
  - GitHub OAuth 集成
    - `getGithubRedirectUrl` - 获取 GitHub 认证重定向 URL
    - `handleGithubCallback` - 处理 GitHub OAuth 回调
  - Google OAuth 集成
    - `getGoogleRedirectUrl` - 获取 Google 认证重定向 URL
    - `handleGoogleCallback` - 处理 Google OAuth 回调
    - 支持获取用户基本信息(email、profile等)
    - 实现 state 管理确保安全性
    - 完整的错误处理机制

- JWT 认证与授权
  - `DefaultJWTService` - JWT 服务实现
  - `createJWTMiddleware` - JWT 中间件工厂函数
  - 支持 token 生成、验证和刷新

##### 🔧 核心功能
- 状态管理服务用于 OAuth 流程
- 类型安全的 API 设计
- 完整的错误处理
- 环境变量配置支持

##### 📚 文档
- 详细的安装和使用说明
- 完整的 API 文档
- 环境变量配置指南
- 使用示例代码

##### 🔐 安全性
- OAuth state 参数验证
- 安全的 token 处理
- 环境变量配置验证
