# 更新日志 (CHANGELOG)

本文档记录了 @aiho/react 的所有重要变更。我们遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/) 规范，并使用以下标记来标识变更类型：

- **✨ 新功能**：新增的功能
- **🔥 增强**：对现有功能的改进
- **🐛 修复**：错误修复
- **📝 文档**：文档更新
- **🔧 维护**：代码维护和优化


<details open>
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