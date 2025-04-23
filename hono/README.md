# @aiho/hono

一个基于 Hono 框架的实用工具集，提供 OAuth、JWT 和其他实用功能。

## 功能

- OAuth 认证（GitHub 和 Google）
- JWT 认证和授权
- 状态管理
- 文件上传服务

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

## 更新日志 (CHANGELOG)

查看完整的[更新日志](./CHANGELOG.md)了解所有版本的变更详情。
