# 更新日志 (CHANGELOG)

本文档记录了 @aiho/hono 的所有重要变更。我们遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/) 规范，并使用以下标记来标识变更类型：

- **✨ 新功能**：新增的功能
- **🔥 增强**：对现有功能的改进
- **🐛 修复**：错误修复
- **📝 文档**：文档更新
- **🔧 维护**：代码维护和优化


<details open>
<summary><strong>0.1.5</strong></summary>

## 🔧 维护

### 🔥 模块结构优化
- 重构项目结构，遵循 JSR 规范，使用 `mod.ts` 作为模块入口
- 为 `jwt`、`oauth`、`state` 和 `upload` 模块添加了 `mod.ts` 文件
- 将 `upload/index.ts` 重命名为 `upload/mod.ts`
- 优化导出结构，支持按需引入以减小打包体积

### 📝 文档更新
- 更新 README 中的导入示例，推荐使用按需导入方式
- 添加更详细的模块导入说明和示例
- 完善 API 文档，明确各模块的导入路径

### 🔥 导出路径增强
- 添加更细粒度的导出路径，支持直接访问子模块
- 移除整体导入方式，鼓励使用模块化导入以优化打包体积
- 保留原有细粒度导入路径，确保向后兼容性

</details>

<details>
<summary><strong>0.1.4</strong></summary>

## 🔥 新功能

### ✨ 文件上传服务
- `createUploadService` - 创建通用文件上传服务
- 支持多种文件类型的上传
- 支持自定义上传目录
- 支持文件大小和类型验证
- 与 JWT 中间件兼容
- 支持自定义文件名生成

</details>

<details>
<summary><strong>0.1.3</strong></summary>

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
</details>

