# 更新日志 (CHANGELOG)

本文档记录了 @aiho/hono 的所有重要变更。我们遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/) 规范，并使用以下标记来标识变更类型：

- **✨ 新功能**：新增的功能
- **🔥 增强**：对现有功能的改进
- **🐛 修复**：错误修复
- **📝 文档**：文档更新
- **🔧 维护**：代码维护和优化

<details>
<summary><strong>0.1.2</strong> (2023-05-20)</summary>

## 🎉 首次发布

### ✨ 新功能
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

### 🔧 核心功能
- 状态管理服务用于 OAuth 流程
- 类型安全的 API 设计
- 完整的错误处理
- 环境变量配置支持

### 📚 文档
- 详细的安装和使用说明
- 完整的 API 文档
- 环境变量配置指南
- 使用示例代码

### 🔐 安全性
- OAuth state 参数验证
- 安全的 token 处理
- 环境变量配置验证
</details>

## 当前版本

当前最新版本是 **0.1.3**。

<!-- 在此处添加新版本，最新版本放在最上面 -->

<details open>
<summary><strong>0.1.3</strong> (2023-06-15)</summary>

## 🔥 新功能

### ✨ 文件上传服务
- `createUploadService` - 创建通用文件上传服务
- 支持多种文件类型的上传
- 支持自定义上传目录
- 支持文件大小和类型验证
- 与 JWT 中间件兼容
- 支持自定义文件名生成

### 📝 文档
- 添加了文件上传服务的使用示例
- 完整的 API 文档
- 改进了 JSDoc 注释，提高了 JSR 文档分数

### 🔧 维护
- 优化了文件结构
- 改进了类型定义

</details>
