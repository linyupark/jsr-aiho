# @aiho/hono

一个基于 [Hono](https://hono.dev/) 框架的实用工具集，提供 OAuth、JWT 和其他实用功能。该库旨在简化 Hono 应用程序中的身份验证、授权和文件上传功能的实现。

该库为 Deno 和 Hono 项目提供了类型安全、易于使用的 API，可以快速集成到现有项目中。

## 功能

- **OAuth 认证**：支持 GitHub 和 Google 等第三方登录
- **JWT 认证和授权**：简化的 JWT 令牌生成、验证和中间件
- **状态管理**：安全的 OAuth 状态管理机制
- **文件上传服务**：支持多种文件类型的上传、验证和存储

## 主要模块

- `@aiho/hono/jwt`：JWT 服务和类型
- `@aiho/hono/jwt/middleware`：JWT 中间件
- `@aiho/hono/oauth/services/github`：GitHub OAuth 集成
- `@aiho/hono/oauth/services/google`：Google OAuth 集成
- `@aiho/hono/state`：状态管理服务
- `@aiho/hono/upload`：文件上传服务

## 安装

### Deno

```ts
// 导入所有功能
import * as aihoHono from "jsr:@aiho/hono";

// 或者单独导入特定功能
import { getGithubRedirectUrl } from "jsr:@aiho/hono/oauth/services/github";
import { DefaultJWTService } from "jsr:@aiho/hono/jwt";
import { createUploadService } from "jsr:@aiho/hono/upload";
```

## 使用示例

### OAuth 认证

```ts
import { Hono } from "hono";
import { getGithubRedirectUrl, handleGithubCallback } from "jsr:@aiho/hono/oauth/services/github";

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
import { createJWTMiddleware } from "jsr:@aiho/hono/jwt/middleware";

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

### 文件上传服务

```ts
import { Hono } from "hono";
import { createUploadService } from "jsr:@aiho/hono/upload";
import { createJWTMiddleware } from "jsr:@aiho/hono/jwt/middleware";

const app = new Hono();

// 创建 JWT 中间件
// ...

// 创建头像上传服务
const avatarUploadService = createUploadService({
  allowedTypes: /image\/(jpeg|jpg|png|gif|webp)/,
  maxSize: 2 * 1024 * 1024, // 2MB
  uploadDir: "avatars"
});

// 创建文档上传服务
const documentUploadService = createUploadService({
  allowedTypes: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  maxSize: 10 * 1024 * 1024, // 10MB
  uploadDir: "documents"
});

// 使用上传服务
app.post("/upload/avatar", jwtMiddleware, (c) => avatarUploadService.handleUpload(c));
app.post("/upload/document", jwtMiddleware, (c) => documentUploadService.handleUpload(c));

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

## API 文档

每个模块都提供了详细的 JSDoc 文档注释，可以在编辑器中查看。主要类和函数包括：

### JWT 模块

- `DefaultJWTService`：JWT 服务的默认实现
- `createJWTMiddleware`：创建 JWT 验证中间件

### OAuth 模块

- `getGithubRedirectUrl`：获取 GitHub OAuth 重定向 URL
- `handleGithubCallback`：处理 GitHub OAuth 回调
- `getGoogleRedirectUrl`：获取 Google OAuth 重定向 URL
- `handleGoogleCallback`：处理 Google OAuth 回调

### 状态管理模块

- `createState`：创建一个新的 state 并存储关联的数据
- `getStateData`：获取并校验 state，返回关联的数据
- `deleteStateData`：删除一个已使用的 state
- `clearExpiredStateData`：清理过期的 state

### 上传模块

- `createUploadService`：创建文件上传服务
- `ensureDir`：确保目录存在，如果不存在则创建

## 更新日志 (CHANGELOG)

查看完整的[更新日志](./hono/CHANGELOG.md)了解所有版本的变更详情。
