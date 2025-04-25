# @aiho/react

React utility hooks and components for enterprise applications

## 功能

- **移动端适配**：提供 rem 单位转换，自动计算缩放比例
- **设备检测**：检测设备类型和屏幕尺寸，支持响应式布局
- **安全区域处理**：自动设置安全区域相关的 CSS 变量
- **资源预加载**：支持并行加载大量资源（图片等），提供加载进度监控
- **数据请求增强**：基于 SWR 的增强版数据请求 hook，支持手动触发和灵活控制
- **网络请求增强**：增强版 fetch hook，支持中断请求、超时设置、错误处理等
- **高度可配置**：所有 hooks 都支持自定义配置，使其更加灵活

## 主要模块

- `@aiho/react/hooks`：React hooks 集合
  - `useRem`：rem 单位转换 hook
  - `useSafeArea`：安全区域处理 hook
  - `useDevice`：设备检测 hook
  - `useWXSDK`：微信 JSSDK 集成 hook
  - `useResourceLoader`：资源预加载 hook
  - `useSwrEnhanced`：增强版 SWR 数据请求 hook
  - `useFetchEnhanced`：增强版 fetch hook，支持中断请求、超时设置等

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

### useResourceLoader

```tsx
import { useResourceLoader } from '@aiho/react/hooks';

function LoadingScreen() {
  const {
    progress,
    isLoading,
    isComplete,
    errors
  } = useResourceLoader({
    resources: [
      { type: 'image', url: '/images/background.jpg' },
      { type: 'image', url: '/images/logo.png' },
      { type: 'image', url: '/images/icon1.svg' },
      { type: 'image', url: '/images/icon2.svg' }
    ],
    onLoaded: () => {
      console.log('所有资源加载完成');
    }
  });

  return (
    <div className="loading-screen">
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="progress-text">
        {isComplete ? '加载完成' : `加载中... ${Math.floor(progress)}%`}
      </div>
    </div>
  );
}
```

### useSwrEnhanced

```tsx
import { useSwrEnhanced } from '@aiho/react/hooks';

function UserProfile() {
  const {
    data,
    error,
    isLoading,
    isValidating,
    trigger
  } = useSwrEnhanced('/api/user', {
    autoFetch: true, // 默认为 true，组件挂载时自动请求
    fetcher: (url) => fetch(url).then(res => res.json())
  });

  if (isLoading) return <div>加载中...</div>;
  if (error) return <div>加载失败: {error.message}</div>;

  return (
    <div>
      <h1>{data.name}</h1>
      <button
        onClick={() => trigger()}
        disabled={isValidating}
      >
        {isValidating ? '刷新中...' : '手动刷新'}
      </button>
    </div>
  );
}
```

### useFetchEnhanced

```tsx
import { useFetchEnhanced, useSwrEnhanced } from '@aiho/react/hooks';

// 创建增强版的 fetch
const { fetch: enhancedFetch } = useFetchEnhanced({
  baseURL: 'https://api.example.com',
  headers: { 'Content-Type': 'application/json' },
  timeout: 5000, // 5秒超时
  throwHttpErrors: true, // 自动处理 HTTP 错误状态码
  retry: { count: 3, delay: 1000 } // 失败重试3次
});

// 在 SWR 中使用
function UserList() {
  const { data, error, isLoading } = useSwrEnhanced('/users', {
    fetcher: (url) => enhancedFetch(url)
  });

  if (isLoading) return <div>加载中...</div>;
  if (error) return <div>加载失败: {error.message}</div>;

  return (
    <ul>
      {data.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

// POST 请求示例
function CreateUser() {
  const { fetch: enhancedFetch } = useFetchEnhanced({
    baseURL: 'https://api.example.com',
    headers: { 'Content-Type': 'application/json' }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const userData = {
      name: form.name.value,
      email: form.email.value
    };

    try {
      const result = await enhancedFetch('/users', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      console.log('用户创建成功:', result);
    } catch (err) {
      console.error('创建失败:', err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="姓名" required />
      <input name="email" type="email" placeholder="邮箱" required />
      <button type="submit">创建用户</button>
    </form>
  );
}
```

## 许可证

MIT

## 更新日志 (CHANGELOG)

查看完整的[更新日志](./react/CHANGELOG.md)了解所有版本的变更详情。
