# @aiho/react

React utility hooks and components for enterprise applications

## 功能

- **移动端适配**：提供 rem 单位转换，自动计算缩放比例
- **设备检测**：检测设备类型和屏幕尺寸，支持响应式布局
- **安全区域处理**：自动设置安全区域相关的 CSS 变量
- **高度可配置**：所有 hooks 都支持自定义配置，使其更加灵活

## 主要模块

- `@aiho/react/hooks`：React hooks 集合
  - `useRem`：rem 单位转换 hook
  - `useSafeArea`：安全区域处理 hook
  - `useDevice`：设备检测 hook

## 安装

### Deno

```ts
// 导入所有功能
import * as aihoReact from "jsr:@aiho/react";

// 或者单独导入特定功能
import { useRem, useSafeArea, useDevice } from "jsr:@aiho/react/hooks";
```

## 使用示例

### useRem - rem 单位转换

```tsx
import { useRem } from "jsr:@aiho/react/hooks";

// 使用默认配置
function App() {
  const { px2rem } = useRem();

  return (
    <div style={{ fontSize: px2rem(16) }}>
      这段文字大小为 16px 对应的 rem 值
    </div>
  );
}

// 使用自定义配置
function CustomApp() {
  const { px2rem } = useRem({
    baseWidth: 750,  // 自定义基准宽度
    baseSize: 20     // 自定义基准字体大小
  });

  return (
    <div style={{ fontSize: px2rem(16) }}>
      这段文字大小为 16px 对应的 rem 值
    </div>
  );
}
```

### useSafeArea - 安全区域处理

```tsx
import { useSafeArea } from "jsr:@aiho/react/hooks";

// 使用默认配置
function App() {
  const safeArea = useSafeArea();

  return (
    <div style={{
      paddingTop: `${safeArea.top}px`,
      paddingBottom: `${safeArea.bottom}px`
    }}>
      内容将避开顶部和底部的安全区域
    </div>
  );
}

// 使用自定义配置
function CustomApp() {
  const safeArea = useSafeArea({
    cssVarNames: {
      top: '--safe-area-top',       // 自定义顶部安全区域 CSS 变量名
      right: '--safe-area-right',   // 自定义右侧安全区域 CSS 变量名
      bottom: '--safe-area-bottom', // 自定义底部安全区域 CSS 变量名
      left: '--safe-area-left'      // 自定义左侧安全区域 CSS 变量名
    }
  });

  return (
    <div style={{
      paddingTop: `${safeArea.top}px`,
      paddingBottom: `${safeArea.bottom}px`
    }}>
      内容将避开顶部和底部的安全区域
    </div>
  );
}
```

### useDevice - 设备检测

```tsx
import { useDevice } from "jsr:@aiho/react/hooks";

// 使用默认配置
function App() {
  const { isMobile, deviceType, isDetecting } = useDevice();

  // 在检测完成前显示加载状态
  if (isDetecting) {
    return <div>正在检测设备信息...</div>;
  }

  return (
    <div>
      {isMobile ? '移动端布局' : '桌面端布局'}
      <p>设备类型: {deviceType}</p>
    </div>
  );
}

// 使用自定义配置
function CustomApp() {
  const { isMobile, deviceType, isDetecting } = useDevice({
    mobileBreakpoint: 640  // 自定义断点宽度
  });

  return (
    <div>
      {isDetecting ? '正在检测...' :
        isMobile ? '移动端布局' : '桌面端布局'}
      <p>设备类型: {deviceType}</p>
    </div>
  );
}
```

## API 文档

每个模块都提供了详细的 JSDoc 文档注释，可以在编辑器中查看。主要函数和类型包括：

### useRem

```tsx
function useRem(options?: UseRemOptions): { px2rem: (px: number) => string; rem2px: (rem: number) => number }

interface UseRemOptions {
  baseWidth?: number; // 基准宽度，默认为 375px
  baseSize?: number;  // 基准字体大小，默认为 16px
}
```

### useSafeArea

```tsx
function useSafeArea(options?: UseSafeAreaOptions): SafeArea

interface UseSafeAreaOptions {
  cssVarNames?: Partial<CssVarNames>; // CSS 变量名称配置
}

interface CssVarNames {
  top: string;    // 顶部安全区域 CSS 变量名，默认为 '--sat'
  right: string;  // 右侧安全区域 CSS 变量名，默认为 '--sar'
  bottom: string; // 底部安全区域 CSS 变量名，默认为 '--sab'
  left: string;   // 左侧安全区域 CSS 变量名，默认为 '--sal'
}

interface SafeArea {
  top: number;    // 顶部安全区域高度（像素）
  right: number;  // 右侧安全区域宽度（像素）
  bottom: number; // 底部安全区域高度（像素）
  left: number;   // 左侧安全区域宽度（像素）
}
```

### useDevice

```tsx
function useDevice(options?: UseDeviceOptions): { isMobile: boolean; deviceType: DeviceType; isDetecting: boolean }

interface UseDeviceOptions {
  mobileBreakpoint?: number; // 移动设备断点宽度，默认为 768px
}

type DeviceType = 'mobile' | 'desktop'; // 设备类型
```

## 许可证

MIT

## 更新日志 (CHANGELOG)

查看完整的[更新日志](./react/CHANGELOG.md)了解所有版本的变更详情。
