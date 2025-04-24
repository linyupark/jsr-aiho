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
  - `useWXSDK`：微信 JSSDK 集成 hook

## API 文档

每个模块都提供了详细的 JSDoc 文档注释，可以在编辑器中查看。

## 使用示例

### useRem

```tsx
import { useRem } from '@aiho/react/hooks';

function App() {
  const { px2rem } = useRem();

  return (
    <div style={{ fontSize: px2rem(16) }}>
      自适应文本大小
    </div>
  );
}
```

### useSafeArea

```tsx
import { useSafeArea } from '@aiho/react/hooks';

function App() {
  const safeArea = useSafeArea();

  return (
    <div style={{
      paddingTop: `${safeArea.top}px`,
      paddingBottom: `${safeArea.bottom}px`
    }}>
      内容将避开安全区域
    </div>
  );
}
```

### useDevice

```tsx
import { useDevice } from '@aiho/react/hooks';

function App() {
  const { isMobile, deviceType } = useDevice();

  return (
    <div>
      {isMobile ? '移动端布局' : '桌面端布局'}
      <p>设备类型: {deviceType}</p>
    </div>
  );
}
```

### useWXSDK

```tsx
import { useWXSDK } from '@aiho/react/hooks';

function WeChatApp() {
  const {
    isReady,
    isLoggedIn,
    token,
    error,
    loading,
    init,
    login,
    logout
  } = useWXSDK({
    appId: 'your-app-id',
    getSignatureUrl: '/api/wx/signature',
    authUrl: '/api/wx/auth'
  });

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error.message}</div>;

  return (
    <div>
      <p>JSSDK 状态: {isReady ? '已就绪' : '未就绪'}</p>
      <p>登录状态: {isLoggedIn ? '已登录' : '未登录'}</p>
      {!isReady && <button onClick={init}>初始化 JSSDK</button>}
      {isReady && !isLoggedIn && <button onClick={login}>微信登录</button>}
      {isLoggedIn && <button onClick={logout}>退出登录</button>}
    </div>
  );
}
```

## 许可证

MIT

## 更新日志 (CHANGELOG)

查看完整的[更新日志](./react/CHANGELOG.md)了解所有版本的变更详情。
