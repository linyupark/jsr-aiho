import { useEffect, useState, useCallback } from 'react'

/**
 * 微信 JSSDK 集成 hook，用于在 React 应用中集成微信 JSSDK 功能。
 * 该 hook 提供了微信 JSSDK 的初始化、登录、登出等功能，并管理相关状态。
 * 支持自定义配置，如 appId、接口列表、调试模式等。
 *
 * @example 基本用法
 * ```tsx
 * import { useWXSDK } from '@aiho/react/hooks';
 *
 * function WeChatApp() {
 *   const { isReady, isLoggedIn, token, error, loading, init, login, logout } = useWXSDK({
 *     appId: 'your-app-id',
 *     getSignatureUrl: '/api/wx/signature',
 *     authUrl: '/api/wx/auth'
 *   });
 *
 *   if (loading) return <div>加载中...</div>;
 *   if (error) return <div>错误: {error.message}</div>;
 *
 *   return (
 *     <div>
 *       <p>JSSDK 状态: {isReady ? '已就绪' : '未就绪'}</p>
 *       <p>登录状态: {isLoggedIn ? '已登录' : '未登录'}</p>
 *       {!isReady && <button onClick={init}>初始化 JSSDK</button>}
 *       {isReady && !isLoggedIn && <button onClick={login}>微信登录</button>}
 *       {isLoggedIn && <button onClick={logout}>退出登录</button>}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example 自定义配置
 * ```tsx
 * import { useWXSDK } from '@aiho/react/hooks';
 *
 * function CustomWeChatApp() {
 *   const wxSDK = useWXSDK({
 *     appId: 'your-app-id',
 *     getSignatureUrl: '/api/wx/signature',
 *     authUrl: '/api/wx/auth',
 *     jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'chooseImage'],
 *     debug: true,
 *     tokenKey: 'custom_wx_token',
 *     autoInit: false,
 *     onReady: () => console.log('微信 JSSDK 已就绪')
 *   });
 *
 *   // 使用解构获取所需的状态和方法
 *   const { isReady, init } = wxSDK;
 *
 *   return (
 *     <div>
 *       {!isReady && <button onClick={init}>手动初始化 JSSDK</button>}
 *       {isReady && <div>JSSDK 已就绪，可以使用微信 API</div>}
 *     </div>
 *   );
 * }
 * ```
 *
 * @module
 */

// 添加微信 JSSDK 的类型声明
// 注意：避免使用 global 扩展，而是使用模块内部类型

/**
 * 微信 JSSDK 配置参数接口
 */
export interface WXConfig {
  debug: boolean
  appId: string
  timestamp: number | string
  nonceStr: string
  signature: string
  jsApiList: string[]
}

/**
 * 微信 JSSDK 错误响应接口
 */
export interface WXErrorResponse {
  errMsg: string
}

/**
 * 微信 JSSDK 实例接口
 *
 * 定义了微信 JSSDK 的核心方法和属性
 */
export interface WXInstance {
  config: (config: WXConfig) => void
  ready: (callback: () => void) => void
  error: (callback: (res: WXErrorResponse) => void) => void

  // 常用的微信 JSSDK API 方法
  updateAppMessageShareData?: (config: Record<string, unknown>) => void
  updateTimelineShareData?: (config: Record<string, unknown>) => void
  chooseImage?: (config: Record<string, unknown>) => void

  // 其他可能的 API 方法，使用索引签名但限制为函数类型
  [key: string]: ((config?: Record<string, unknown>) => void) | unknown
}

/**
 * 从 URL 查询参数中获取指定参数的值
 *
 * 该函数用于从当前 URL 的查询参数中获取指定名称的参数值。
 * 如果在服务器端渲染环境中调用（无 window 对象），则返回 null。
 *
 * @param param 要获取的查询参数名称
 * @returns 参数值，如果参数不存在则返回 null
 *
 * @example
 * ```ts
 * // 假设当前 URL 为 https://example.com?code=123&state=abc
 * const code = getSearchParam('code'); // 返回 "123"
 * const state = getSearchParam('state'); // 返回 "abc"
 * const notExist = getSearchParam('notExist'); // 返回 null
 * ```
 */
export const getSearchParam = (param: string): string | null => {
  // 使用 globalThis 代替 window，兼容 Deno 环境
  if (typeof globalThis.location === 'undefined') return null
  const searchParams = new URLSearchParams(globalThis.location.search)
  return searchParams.get(param)
}

/**
 * 微信 JSSDK 配置选项接口
 *
 * 该接口定义了初始化微信 JSSDK 所需的配置参数。
 *
 * @example
 * ```ts
 * import { useWXSDK } from '@aiho/react/hooks';
 *
 * // 基本配置
 * const config: WXSDKConfig = {
 *   appId: 'wx12345678',
 *   getSignatureUrl: '/api/wx/signature',
 *   authUrl: '/api/wx/auth'
 * };
 *
 * // 使用配置
 * const wxSDK = useWXSDK(config);
 * ```
 */
export interface WXSDKConfig {
  /**
   * 微信公众号的 appId
   *
   * 在微信公众平台获取的应用 ID
   */
  appId: string

  /**
   * 获取签名的接口 URL
   *
   * 该接口应返回包含 signature、nonceStr、timestamp 和 jsApiList 的数据
   */
  getSignatureUrl: string

  /**
   * 微信认证接口 URL
   *
   * 用于处理微信授权回调，接收 code 参数并返回 token
   */
  authUrl: string

  /**
   * 需要使用的 JS 接口列表
   *
   * 默认包含 'updateAppMessageShareData' 和 'updateTimelineShareData'
   *
   * @default ['updateAppMessageShareData', 'updateTimelineShareData']
   */
  jsApiList?: string[]

  /**
   * 是否开启调试模式
   *
   * 开启后会在网页底部显示调试信息
   *
   * @default false
   */
  debug?: boolean

  /**
   * 存储 token 的 localStorage key
   *
   * @default 'wx_token'
   */
  tokenKey?: string

  /**
   * 是否自动初始化 JSSDK
   *
   * 如果设为 false，需要手动调用 init 方法
   *
   * @default true
   */
  autoInit?: boolean

  /**
   * JSSDK 就绪时的回调函数
   */
  onReady?: () => void
}

/**
 * 微信签名接口返回的数据结构
 *
 * 该接口定义了从签名接口获取的数据结构
 */
interface WXResponseData {
  /**
   * 微信签名
   */
  signature: string

  /**
   * 随机字符串
   */
  nonceStr: string

  /**
   * 时间戳
   */
  timestamp: number | string

  /**
   * JS API 列表
   */
  jsApiList: string[]

  /**
   * 其他可能的字段
   * 使用更精确的类型代替 any
   */
  [key: string]: string | number | boolean | string[] | Record<string, unknown>
}

/**
 * useWXSDK hook 返回的对象类型
 *
 * 该接口定义了 useWXSDK hook 返回的状态和方法
 *
 * @example
 * ```ts
 * import { useWXSDK } from '@aiho/react/hooks';
 *
 * function WeChatComponent() {
 *   const {
 *     isReady,    // JSSDK 是否已就绪
 *     isLoggedIn, // 用户是否已登录
 *     token,      // 用户登录 token
 *     error,      // 错误信息
 *     loading,    // 加载状态
 *     init,       // 初始化方法
 *     login,      // 登录方法
 *     logout      // 登出方法
 *   } = useWXSDK({
 *     appId: 'your-app-id',
 *     getSignatureUrl: '/api/wx/signature',
 *     authUrl: '/api/wx/auth'
 *   });
 *
 *   // 使用这些状态和方法构建 UI
 * }
 * ```
 */
export interface WXSDKResponse {
  /**
   * JSSDK 是否已就绪
   */
  isReady: boolean

  /**
   * 用户是否已登录
   */
  isLoggedIn: boolean

  /**
   * 用户登录 token，未登录时为 null
   */
  token: string | null

  /**
   * 错误信息，无错误时为 null
   */
  error: Error | null

  /**
   * 加载状态
   */
  loading: boolean

  /**
   * 初始化 JSSDK
   *
   * 加载 JSSDK 脚本，获取签名并配置 JSSDK
   *
   * @returns Promise<void>
   */
  init: () => Promise<void>

  /**
   * 微信登录
   *
   * 如果 URL 中没有 code 参数，会跳转到微信授权页面
   * 如果有 code 参数，会调用 authUrl 接口获取 token
   *
   * @returns Promise<string | null> 成功时返回 token，失败时返回 null
   */
  login: () => Promise<string | null>

  /**
   * 登出
   *
   * 清除本地存储的 token 并更新状态
   */
  logout: () => void
}

const DEFAULT_JS_API_LIST = [
  'updateAppMessageShareData',
  'updateTimelineShareData'
]

export const useWXSDK = ({
  appId,
  getSignatureUrl,
  authUrl,
  jsApiList = DEFAULT_JS_API_LIST,
  debug = false,
  tokenKey = 'wx_token',
  autoInit = true,
  onReady
}: WXSDKConfig): WXSDKResponse => {
  const [isReady, setIsReady] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(false)

  const code = getSearchParam('code')

  /**
   * 声明全局 window 接口，用于微信 SDK
   */
  interface WindowWithWX extends Window {
    wx?: WXInstance
  }

  // 加载微信 JSSDK
  const loadSDK = useCallback((): Promise<void> => {
    // 使用类型断言将 globalThis 转换为包含 wx 属性的窗口对象
    const win = globalThis as unknown as WindowWithWX

    if (win.wx) {
      return Promise.resolve()
    }

    return new Promise<void>((resolve, reject) => {
      if (typeof document === 'undefined') {
        reject(new Error('Document is not available in this environment'))
        return
      }

      const script = document.createElement('script')
      script.src = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js'
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load WeChat JSSDK'))
      document.head.appendChild(script)
    })
  }, [])

  // 获取签名配置
  const getSignature = async (): Promise<WXResponseData | null> => {
    try {
      // 确保在浏览器环境中运行
      if (typeof globalThis.location === 'undefined') {
        throw new Error('Location is not available in this environment')
      }

      const response = await fetch(getSignatureUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: globalThis.location.href.split('#')[0],
          jsApiList
        })
      })

      const data = await response.json()
      return typeof data === 'string' ? JSON.parse(data) : data
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to get signature')
      )
      return null
    }
  }

  // 初始化 SDK
  const init = async (): Promise<void> => {
    try {
      setLoading(true)
      await loadSDK()
      const signatureData = await getSignature()

      if (!signatureData) {
        throw new Error('Failed to get signature data')
      }

      const win = globalThis as unknown as WindowWithWX

      if (!win.wx) {
        throw new Error('WeChat JSSDK not loaded')
      }

      win.wx.config({
        debug,
        appId,
        timestamp: signatureData.timestamp,
        nonceStr: signatureData.nonceStr,
        signature: signatureData.signature,
        jsApiList: signatureData.jsApiList
      })

      win.wx.ready(() => {
        setIsReady(true)
        onReady?.()
        setError(null)
      })

      win.wx.error((res: WXErrorResponse) => {
        setError(new Error(res.errMsg))
      })
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to initialize JSSDK')
      )
    } finally {
      setLoading(false)
    }
  }

  /**
   * 微信认证响应接口
   */
  interface WXAuthResponse {
    code: number
    token?: string
    message?: string
    [key: string]: unknown
  }

  // 登录方法
  const login = async (): Promise<string | null> => {
    try {
      // 确保在浏览器环境中运行
      if (typeof globalThis.location === 'undefined') {
        throw new Error('Location is not available in this environment')
      }

      if (!code) {
        const redirect_uri = encodeURIComponent(globalThis.location.href)
        const authPageUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=#wechat_redirect`
        globalThis.location.href = authPageUrl
        return null
      }

      const response = await fetch(`${authUrl}?code=${code}`)
      const data = (await response.json()) as WXAuthResponse

      if (data.code === 0 && data.token) {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(tokenKey, data.token)
        }
        setToken(data.token)
        setIsLoggedIn(true)

        // 清除URL中的code参数
        const newUrl = new URL(globalThis.location.href)
        newUrl.searchParams.delete('code')
        newUrl.searchParams.delete('state')
        if (typeof history !== 'undefined') {
          history.replaceState({}, '', newUrl)
        }

        return data.token
      }

      throw new Error(data.message || 'Login failed')
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Login failed'))
      return null
    }
  }

  // 登出方法
  const logout = (): void => {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(tokenKey)
    }
    setToken(null)
    setIsLoggedIn(false)
  }

  // 初始化效果
  useEffect(() => {
    // 检查本地存储的token
    if (typeof localStorage !== 'undefined') {
      const storedToken = localStorage.getItem(tokenKey)
      if (storedToken) {
        setToken(storedToken)
        setIsLoggedIn(true)
      }
    }

    // 自动初始化
    if (autoInit) {
      init().catch((error) => {
        console.error('Failed to initialize WeChat JSSDK:', error)
      })
    }
  }, [])

  return {
    isReady,
    isLoggedIn,
    token,
    error,
    loading,
    init,
    login,
    logout
  }
}

export default useWXSDK
