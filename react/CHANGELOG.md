# 更新日志 (CHANGELOG)

本文档记录了 @aiho/react 的所有重要变更。我们遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/) 规范，并使用以下标记来标识变更类型：

- **✨ 新功能**：新增的功能
- **🔥 增强**：对现有功能的改进
- **🐛 修复**：错误修复
- **📝 文档**：文档更新
- **🔧 维护**：代码维护和优化

<details open>
<summary><strong>0.1.4</strong></summary>

## ✨ 新功能

### ✨ 新增微信 JSSDK 集成 hook
- 新增 `useWXSDK` hook，用于在 React 应用中集成微信 JSSDK 功能
- 支持微信 JSSDK 的初始化、登录、登出等功能
- 提供完整的状态管理，包括就绪状态、登录状态、错误处理等
- 支持自定义配置，如 appId、接口列表、调试模式等
- 导出了新的类型和接口：`WXSDKConfig` 和 `WXSDKResponse`
- 添加了详细的 JSDoc 文档和使用示例

## 📝 文档

### 📝 文档更新
- 更新 README.md，添加了各个 hooks 的使用示例代码
- 为 `useWXSDK` hook 添加了详细的 JSDoc 文档
- 完善了类型定义的文档注释

## 🔧 维护

### 🔧 类型定义优化
- 优化了 `useWXSDK` 的类型定义，避免使用全局类型扩展
- 修复了 JSR 类型检查的兼容性问题
- 导出了 `WXInstance` 类型，便于用户扩展微信 SDK 功能
</details>

<details>
<summary><strong>0.1.3</strong></summary>

## 📝 文档

### 📝 JSR 文档规范兼容性提升
- 完善了所有导出符号的 JSDoc 文档，提高文档覆盖率至 80% 以上
- 为 `px2rem` 和 `rem2px` 函数添加了详细的文档和多个使用场景示例
- 为 `useRem` hook 添加了更详细的工作原理、参数说明和使用示例
- 为 `DeviceType` 和 `UseDeviceOptions` 类型添加了详细的文档和使用示例
- 为 `SafeArea` 和 `CssVarNames` 接口添加了详细的属性说明和使用示例
- 为所有 hooks 添加了高级使用场景的示例代码
- 优化了示例代码的格式，确保与 TypeScript 编译器兼容

### 📝 API 文档增强
- 添加了更多实际应用场景的示例代码
- 为每个接口属性添加了详细的说明和用途解释
- 增加了与 CSS 结合使用的示例
- 添加了组件库开发中使用 hooks 的示例
- 完善了参数和返回值的类型说明

## 🔧 维护

### 🔧 代码质量提升
- 修复了 JSDoc 示例中的 TypeScript 类型错误
- 统一了文档风格和格式
- 优化了代码注释的可读性
</details>


<details>
<summary><strong>0.1.2</strong></summary>

## 🔥 增强

### 🔥 useDevice hook 增强
- 增强了 `useDevice` hook，添加 `isDetecting` 状态标记
- 改进了设备检测逻辑，避免默认值导致的不准确判断
- 增强了客户端检测，避免服务器端渲染问题
- 更新了文档和示例代码，展示如何利用 `isDetecting` 状态

## 🐛 修复

### 🐛 修复 useSafeArea hook 的无限循环问题
- 修复了 `useSafeArea` hook 在 useEffect 中使用 setState 触发死循环的问题
- 使用 useMemo 缓存配置对象，避免不必要的重新渲染

</details>

<details>
<summary><strong>0.1.1</strong></summary>

## ✨ 新功能

### ✨ 新增设备检测 hook
- 新增 `useDevice` hook，用于检测设备类型和屏幕尺寸
- 支持通过 `isMobile` 属性判断当前屏幕是否为移动设备尺寸
- 支持通过 `deviceType` 属性获取实际设备类型（'mobile' 或 'desktop'）
- 支持自定义移动设备断点宽度
- 导出了新的类型和接口：`DeviceType` 和 `UseDeviceOptions`

## 🔥 增强

### 🔥 hooks 可配置性增强
- 增强了 `useRem` hook 的灵活性，支持自定义基准宽度和基准字体大小
- 增强了 `useSafeArea` hook 的灵活性，支持自定义 CSS 变量名称
- 导出了新的类型和接口：`UseRemOptions`、`CssVarNames` 和 `UseSafeAreaOptions`
- 更新了文档和示例代码，展示如何使用自定义配置

</details>

<details>
<summary><strong>0.1.0</strong></summary>

## 🎉 首次发布

### ✨ 新功能
- 移动端适配
  - `useRem` - rem 单位转换 hook
  - `px2rem` - 将像素值转换为 rem 字符串的函数
  - `rem2px` - 将 rem 值转换为像素数值的函数

- 安全区域处理
  - `useSafeArea` - 安全区域处理 hook
  - 自动设置安全区域相关的 CSS 变量
  - 提供安全区域的尺寸信息
</details>