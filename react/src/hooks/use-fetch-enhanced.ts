// deno-lint-ignore-file no-explicit-any
/**
 * 增强版 fetch hook，提供更灵活的数据请求控制。
 * 该 hook 提供中断请求、设置超时、自定义 header 以及错误处理等功能。
 *
 * @example 基本用法
 * ```tsx
 * import { useFetchEnhanced } from '@aiho/react/hooks';
 *
 * // 创建一个增强版的 fetch 函数
 * const enhancedFetch = useFetchEnhanced({
 *   baseURL: 'https://api.example.com',
 *   headers: {
 *     'Content-Type': 'application/json',
 *   },
 *   timeout: 5000, // 5秒超时
 * });
 *
 * // 在 SWR 中使用
 * const { data, error } = useSWR('/users', enhancedFetch);
 * ```
 *
 * @example POST 请求
 * ```tsx
 * import { useFetchEnhanced } from '@aiho/react/hooks';
 * import { useSWRMutation } from 'swr';
 *
 * function CreateUser() {
 *   const enhancedFetch = useFetchEnhanced({
 *     baseURL: 'https://api.example.com',
 *     headers: {
 *       'Content-Type': 'application/json',
 *     },
 *   });
 *
 *   // 使用 SWR Mutation 进行 POST 请求
 *   const { trigger, isMutating, error } = useSWRMutation(
 *     '/users',
 *     (url, { arg }: { arg: { name: string, email: string } }) =>
 *       enhancedFetch(url, {
 *         method: 'POST',
 *         body: JSON.stringify(arg),
 *       })
 *   );
 *
 *   const handleSubmit = async (e) => {
 *     e.preventDefault();
 *     const formData = new FormData(e.target);
 *     const userData = {
 *       name: formData.get('name') as string,
 *       email: formData.get('email') as string,
 *     };
 *
 *     try {
 *       const result = await trigger(userData);
 *       console.log('User created:', result);
 *     } catch (err) {
 *       console.error('Failed to create user:', err);
 *     }
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input name="name" placeholder="Name" required />
 *       <input name="email" type="email" placeholder="Email" required />
 *       <button type="submit" disabled={isMutating}>
 *         {isMutating ? 'Creating...' : 'Create User'}
 *       </button>
 *       {error && <p>Error: {error.message}</p>}
 *     </form>
 *   );
 * }
 * ```
 *
 * @example 中断请求
 * ```tsx
 * import { useFetchEnhanced } from '@aiho/react/hooks';
 * import { useState } from 'react';
 *
 * function SearchComponent() {
 *   const [results, setResults] = useState([]);
 *   const [isLoading, setIsLoading] = useState(false);
 *   const [error, setError] = useState(null);
 *
 *   // 创建一个可以被中断的 fetch
 *   const { fetch: enhancedFetch, abort } = useFetchEnhanced({
 *     baseURL: 'https://api.example.com',
 *     timeout: 10000,
 *   });
 *
 *   const handleSearch = async (query) => {
 *     // 如果有正在进行的请求，先中断它
 *     abort();
 *
 *     setIsLoading(true);
 *     setError(null);
 *
 *     try {
 *       const data = await enhancedFetch(`/search?q=${encodeURIComponent(query)}`);
 *       setResults(data);
 *     } catch (err) {
 *       // 被中断的请求不会被视为错误
 *       if (err.name !== 'AbortError') {
 *         setError(err);
 *       }
 *     } finally {
 *       setIsLoading(false);
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       <input
 *         type="text"
 *         onChange={(e) => handleSearch(e.target.value)}
 *         placeholder="Search..."
 *       />
 *       {isLoading && <div>Loading...</div>}
 *       {error && <div>Error: {error.message}</div>}
 *       <ul>
 *         {results.map(item => (
 *           <li key={item.id}>{item.name}</li>
 *         ))}
 *       </ul>
 *     </div>
 *   );
 * }
 * ```
 *
 * @module
 */

import { useCallback, useRef } from 'react'

/**
 * HTTP 请求方法类型
 */
export type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'PATCH'
  | 'HEAD'
  | 'OPTIONS'

/**
 * 增强版 fetch 配置选项
 */
export interface UseFetchEnhancedOptions extends Omit<RequestInit, 'signal'> {
  /**
   * 基础 URL，会被添加到所有请求的前面
   */
  baseURL?: string

  /**
   * 请求超时时间（毫秒）
   * @default 30000 (30秒)
   */
  timeout?: number

  /**
   * 请求头
   */
  headers?: HeadersInit

  /**
   * 是否自动解析 JSON 响应
   * @default true
   */
  parseJSON?: boolean

  /**
   * 是否自动处理 HTTP 错误状态码（非 2xx）
   * @default true
   */
  throwHttpErrors?: boolean

  /**
   * 请求前的钩子函数
   * 可以用来修改请求配置
   */
  beforeRequest?: (
    url: string,
    options: RequestInit
  ) => [string, RequestInit] | Promise<[string, RequestInit]>

  /**
   * 响应处理钩子函数
   * 可以用来修改响应数据
   */
  afterResponse?: <T>(response: Response, data: T) => T | Promise<T>

  /**
   * 错误处理钩子函数
   */
  onError?: (
    error: Error,
    url: string,
    options: RequestInit
  ) => void | Promise<void>

  /**
   * 重试配置
   */
  retry?: {
    /**
     * 最大重试次数
     * @default 0 (不重试)
     */
    count: number

    /**
     * 重试延迟（毫秒）
     * @default 1000
     */
    delay: number

    /**
     * 是否使用指数退避算法增加重试延迟
     * @default true
     */
    exponentialBackoff?: boolean
  }
}

/**
 * 增强版 fetch 响应类型
 */
export interface UseFetchEnhancedResponse {
  /**
   * 增强版的 fetch 函数
   * @param url 请求 URL
   * @param options 请求选项
   * @returns 请求结果
   */
  fetch: <T>(url: string, options?: Omit<RequestInit, 'signal'>) => Promise<T>

  /**
   * 中断当前请求的函数
   */
  abort: () => void

  /**
   * 创建一个新的 AbortController
   * 用于手动控制请求的中断
   */
  createAbortController: () => AbortController
}

/**
 * HTTP 错误类
 */
export class HttpError extends Error {
  status: number
  statusText: string
  response: Response

  constructor(response: Response, message?: string) {
    super(message || `HTTP Error: ${response.status} ${response.statusText}`)
    this.name = 'HttpError'
    this.status = response.status
    this.statusText = response.statusText
    this.response = response
  }
}

/**
 * 超时错误类
 */
export class TimeoutError extends Error {
  constructor(timeout: number) {
    super(`Request timed out after ${timeout}ms`)
    this.name = 'TimeoutError'
  }
}

/**
 * 增强版 fetch hook
 *
 * 提供中断请求、设置超时、自定义 header 以及错误处理等功能。
 *
 * @param defaultOptions 默认配置选项
 * @returns 增强版 fetch 响应对象
 */
export function useFetchEnhanced(
  defaultOptions: UseFetchEnhancedOptions = {}
): UseFetchEnhancedResponse {
  // 保存当前的 AbortController
  const abortControllerRef = useRef<AbortController | null>(null)

  /**
   * 创建一个新的 AbortController
   */
  const createAbortController = useCallback(() => {
    // 如果已经有一个 AbortController，先中断它
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // 创建一个新的 AbortController
    const controller = new AbortController()
    abortControllerRef.current = controller
    return controller
  }, [])

  /**
   * 中断当前请求
   */
  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
  }, [])

  /**
   * 增强版的 fetch 函数
   */
  const enhancedFetch = useCallback(
    async <T = unknown>(
      /** 请求的 URL 地址 */
      url: string,
      /** fetch 请求的选项 */
      options: Omit<RequestInit, 'signal'> = {}
    ): Promise<T> => {
      // 合并默认选项和传入的选项
      const {
        baseURL = '',
        timeout = 30000,
        headers = {},
        parseJSON = true,
        throwHttpErrors = true,
        beforeRequest,
        afterResponse,
        onError,
        retry = { count: 0, delay: 1000, exponentialBackoff: true },
        ...fetchOptions
      } = { ...defaultOptions, ...options }

      // 创建完整的 URL
      let fullUrl = url.startsWith('http') ? url : `${baseURL}${url}`

      // 合并 headers
      const mergedHeaders = {
        ...headers,
        ...(options.headers || {})
      }

      // 创建请求选项
      let requestOptions: RequestInit = {
        ...fetchOptions,
        headers: mergedHeaders
      }

      // 创建 AbortController
      const controller = createAbortController()
      requestOptions.signal = controller.signal

      // 调用请求前钩子
      if (beforeRequest) {
        ;[fullUrl, requestOptions] = await beforeRequest(
          fullUrl,
          requestOptions
        )
      }

      // 重试逻辑
      let lastError: Error | null = null
      let retryCount = 0

      while (retryCount <= retry.count) {
        try {
          // 创建超时处理
          const timeoutId = setTimeout(() => {
            controller.abort()
          }, timeout)

          try {
            // 发送请求
            const response = await fetch(fullUrl, requestOptions)

            // 清除超时
            clearTimeout(timeoutId)

            // 处理 HTTP 错误
            if (throwHttpErrors && !response.ok) {
              throw new HttpError(response)
            }

            // 解析响应
            let data: any

            if (
              parseJSON &&
              response.headers.get('content-type')?.includes('application/json')
            ) {
              data = await response.json()
            } else {
              const contentType = response.headers.get('content-type')
              if (contentType?.includes('text/')) {
                data = await response.text()
              } else {
                data = await response.blob()
              }
            }

            // 调用响应后钩子
            if (afterResponse) {
              data = await afterResponse<T>(response, data)
            }

            return data as T
          } catch (error: any) {
            // 清除超时
            clearTimeout(timeoutId)

            // 如果是中断错误，直接抛出
            if (error.name === 'AbortError') {
              if (error.message === 'The user aborted a request.') {
                throw error
              } else {
                throw new TimeoutError(timeout)
              }
            }

            // 其他错误，如果还有重试次数，则重试
            lastError = error

            // 如果不需要重试，直接抛出错误
            if (retryCount >= retry.count) {
              throw error
            }

            // 计算重试延迟
            const retryDelay = retry.exponentialBackoff
              ? retry.delay * Math.pow(2, retryCount)
              : retry.delay

            // 等待重试
            await new Promise((resolve) => setTimeout(resolve, retryDelay))

            // 增加重试计数
            retryCount++

            // 创建新的 AbortController
            const newController = createAbortController()
            requestOptions.signal = newController.signal
          }
        } catch (error: any) {
          // 调用错误处理钩子
          if (onError) {
            await onError(error as Error, fullUrl, requestOptions)
          }

          // 如果是最后一次重试，或者是中断错误，则抛出
          if (
            retryCount >= retry.count ||
            (error as Error).name === 'AbortError'
          ) {
            throw error
          }

          lastError = error
        }
      }

      // 如果所有重试都失败，抛出最后一个错误
      if (lastError) {
        throw lastError
      }

      // 这里永远不会执行到，但 TypeScript 需要返回值
      return {} as T
    },
    [defaultOptions, createAbortController]
  )

  return {
    fetch: enhancedFetch,
    abort,
    createAbortController
  }
}

export default useFetchEnhanced
