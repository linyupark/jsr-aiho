/**
 * 增强版 SWR hook，提供更灵活的数据请求控制。
 * 该 hook 基于 SWR 库，增加了手动触发请求和控制自动请求的功能。
 *
 * @example 基本用法
 * ```tsx
 * import { useSwrEnhanced } from '@aiho/react/hooks';
 *
 * function UserProfile() {
 *   const {
 *     data,
 *     error,
 *     isLoading,
 *     isValidating,
 *     trigger
 *   } = useSwrEnhanced('/api/user', {
 *     autoFetch: true, // 默认为 true，组件挂载时自动请求
 *   });
 *
 *   if (isLoading) return <div>加载中...</div>;
 *   if (error) return <div>加载失败: {error.message}</div>;
 *
 *   return (
 *     <div>
 *       <h1>{data.name}</h1>
 *       <button
 *         onClick={() => trigger()}
 *         disabled={isValidating}
 *       >
 *         {isValidating ? '刷新中...' : '手动刷新'}
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example 手动触发请求
 * ```tsx
 * import { useSwrEnhanced } from '@aiho/react/hooks';
 *
 * function UserProfile() {
 *   const {
 *     data,
 *     error,
 *     isLoading,
 *     isValidating,
 *     trigger
 *   } = useSwrEnhanced('/api/user', {
 *     autoFetch: false, // 不自动请求，需要手动触发
 *   });
 *
 *   return (
 *     <div>
 *       {data ? (
 *         <div>
 *           <h1>{data.name}</h1>
 *           <button
 *             onClick={() => trigger()}
 *             disabled={isValidating}
 *           >
 *             {isValidating ? '刷新中...' : '刷新'}
 *           </button>
 *         </div>
 *       ) : (
 *         <button
 *           onClick={() => trigger()}
 *           disabled={isLoading}
 *         >
 *           {isLoading ? '加载中...' : '加载用户信息'}
 *         </button>
 *       )}
 *       {error && <div>错误: {error.message}</div>}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example POST 请求示例
 * ```tsx
 * import { useSwrEnhanced } from '@aiho/react/hooks';
 * import { useFetchEnhanced } from '@aiho/react/hooks';
 * import { useState } from 'react';
 *
 * function CreateUser() {
 *   const [message, setMessage] = useState('');
 *
 *   // 创建增强版的 fetch
 *   const { fetch: enhancedFetch } = useFetchEnhanced({
 *     headers: { 'Content-Type': 'application/json' }
 *   });
 *
 *   // 使用 SWR 增强版进行 POST 请求
 *   const { trigger, isLoading, error } = useSwrEnhanced(
 *     '/api/users',
 *     {
 *       autoFetch: false,
 *       // 自定义 fetcher 函数，使用增强版 fetch 发送 POST 请求
 *       fetcher: (url, userData) => enhancedFetch(url, {
 *         method: 'POST',
 *         body: JSON.stringify(userData)
 *       })
 *     }
 *   );
 *
 *   const handleSubmit = async (e) => {
 *     e.preventDefault();
 *     const form = e.target;
 *     const userData = {
 *       name: form.name.value,
 *       email: form.email.value
 *     };
 *
 *     try {
 *       const result = await trigger(userData);
 *       setMessage(`用户创建成功: ${result.name}`);
 *       form.reset();
 *     } catch (err) {
 *       setMessage(`创建失败: ${err.message}`);
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       <form onSubmit={handleSubmit}>
 *         <div>
 *           <label htmlFor="name">姓名:</label>
 *           <input id="name" name="name" required />
 *         </div>
 *         <div>
 *           <label htmlFor="email">邮箱:</label>
 *           <input id="email" name="email" type="email" required />
 *         </div>
 *         <button type="submit" disabled={isLoading}>
 *           {isLoading ? '创建中...' : '创建用户'}
 *         </button>
 *       </form>
 *
 *       {message && <p>{message}</p>}
 *       {error && <p className="error">错误: {error.message}</p>}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example 带参数的手动触发
 * ```tsx
 * import { useSwrEnhanced } from '@aiho/react/hooks';
 * import { useState } from 'react';
 *
 * function SearchUsers() {
 *   const [query, setQuery] = useState('');
 *   const {
 *     data,
 *     error,
 *     isLoading,
 *     trigger
 *   } = useSwrEnhanced(
 *     () => query ? `/api/search?q=${encodeURIComponent(query)}` : null,
 *     {
 *       autoFetch: false, // 不自动请求
 *     }
 *   );
 *
 *   const handleSearch = () => {
 *     if (query.trim()) {
 *       trigger();
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       <input
 *         type="text"
 *         value={query}
 *         onChange={(e) => setQuery(e.target.value)}
 *         placeholder="搜索用户..."
 *       />
 *       <button
 *         onClick={handleSearch}
 *         disabled={isLoading || !query.trim()}
 *       >
 *         {isLoading ? '搜索中...' : '搜索'}
 *       </button>
 *
 *       {data && (
 *         <div>
 *           <h2>搜索结果:</h2>
 *           {data.length === 0 ? (
 *             <p>没有找到匹配的用户</p>
 *           ) : (
 *             <ul>
 *               {data.map(user => (
 *                 <li key={user.id}>{user.name}</li>
 *               ))}
 *             </ul>
 *           )}
 *         </div>
 *       )}
 *
 *       {error && <div>搜索失败: {error.message}</div>}
 *     </div>
 *   );
 * }
 * ```
 *
 * @module
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import type { SWRConfiguration, Key } from 'swr'
import useSWRMutation from 'swr/mutation'
import type { SWRMutationConfiguration } from 'swr/mutation'

/**
 * 定义通用的数据类型
 */
export type DataType = Record<string, unknown>
export type ErrorType = Error
export type MutationArgType = unknown

/**
 * 增强版 SWR 配置选项
 */
export interface UseSwrEnhancedOptions<Data = DataType, Error = ErrorType>
  extends Omit<SWRConfiguration<Data, Error>, 'fallbackData'> {
  /**
   * 是否自动请求数据
   * 如果设置为 false，则需要手动调用 trigger 方法触发请求
   * @default true
   */
  autoFetch?: boolean

  /**
   * 自定义 fetcher 函数
   * 如果提供，将覆盖默认的 fetcher
   */
  fetcher?: (url: string, ...args: unknown[]) => Promise<Data>
  /**
   * 手动触发请求的配置选项
   */
  mutationOptions?: Omit<
    SWRMutationConfiguration<Data, Error, Key, MutationArgType>,
    keyof SWRConfiguration
  >

  /**
   * 默认数据
   * 用于在数据加载前显示的默认值
   */
  fallbackData?: Data
}

/**
 * 增强版 SWR 响应类型
 */
export interface UseSwrEnhancedResponse<Data = DataType, Error = ErrorType> {
  /**
   * 请求返回的数据
   */
  data: Data | undefined

  /**
   * 请求错误
   */
  error: Error | undefined

  /**
   * 是否正在加载中（首次加载）
   */
  isLoading: boolean

  /**
   * 是否正在验证（包括首次加载和重新验证）
   */
  isValidating: boolean

  /**
   * 手动触发请求的方法
   * @param args 可选参数，传递给 fetcher 函数
   */
  trigger: (args?: MutationArgType) => Promise<Data | undefined>

  /**
   * 手动设置缓存数据
   * @param data 要设置的数据
   * @param shouldRevalidate 是否在设置后重新验证
   */
  mutate: (
    data?:
      | Data
      | Promise<Data>
      | ((currentData?: Data) => Data | Promise<Data> | undefined)
      | undefined,
    shouldRevalidate?: boolean
  ) => Promise<Data | undefined>
}

/**
 * 增强版 SWR hook
 *
 * 提供更灵活的数据请求控制，包括手动触发请求和控制自动请求的功能。
 *
 * @param key 请求的键，可以是字符串、数组、对象、函数或 null
 * @param options 配置选项
 * @returns 增强版 SWR 响应对象
 */
export function useSwrEnhanced<Data = DataType, Error = ErrorType>(
  key: Key | null | (() => Key | null),
  options: UseSwrEnhancedOptions<Data, Error> = {}
): UseSwrEnhancedResponse<Data, Error> {
  const {
    autoFetch = true,
    fetcher,
    mutationOptions = {},
    fallbackData,
    ...swrOptions
  } = options

  // 用于控制是否应该请求数据
  const shouldFetch = useRef<boolean>(autoFetch)

  // 用于存储手动触发的参数
  const [_triggerArgs, setTriggerArgs] = useState<MutationArgType | undefined>(
    undefined
  )

  // 获取全局 mutate 函数
  const { mutate: globalMutate } = useSWRConfig()

  // 处理 key 为函数的情况
  const resolvedKey = typeof key === 'function' ? key() : key

  // 使用 useSWR
  const swr = useSWR<Data, Error>(
    // 只有在 shouldFetch 为 true 时才发送请求
    shouldFetch.current ? resolvedKey : null,
    fetcher || null,
    {
      ...swrOptions,
      fallbackData: fallbackData as Data
    }
  )

  // 使用 useSWRMutation 实现手动触发请求
  const mutation = useSWRMutation<Data, Error, Key, MutationArgType>(
    resolvedKey,
    (url: Key, { arg }: { arg?: MutationArgType }) => {
      if (!fetcher) return Promise.resolve(undefined as undefined as Data)
      return Promise.resolve(
        fetcher(typeof url === 'string' ? url : String(url), arg) as Data
      )
    },
    {
      ...mutationOptions
    } as SWRMutationConfiguration<Data, Error, Key, unknown, Data>
  )

  // 手动触发请求的方法
  const trigger = useCallback(
    (args?: MutationArgType) => {
      setTriggerArgs(args)
      shouldFetch.current = true
      return mutation.trigger(args)
    },
    [mutation]
  )

  // 当 autoFetch 为 true 且组件挂载时自动请求
  useEffect(() => {
    shouldFetch.current = autoFetch
  }, [autoFetch])

  // 合并 useSWR 和 useSWRMutation 的响应
  return {
    // 优先使用 mutation 的数据，如果没有则使用 swr 的数据
    data: mutation.data !== undefined ? mutation.data : swr.data,
    // 合并错误信息
    error: mutation.error || swr.error,
    // 判断是否在加载中
    isLoading: (!swr.data && !swr.error) || mutation.isMutating,
    // 判断是否在验证中
    isValidating: swr.isValidating || mutation.isMutating,
    // 手动触发请求的方法
    trigger,
    // 手动修改数据的方法
    mutate: (data, shouldRevalidate) => {
      // 如果 key 是 null，使用全局 mutate
      if (resolvedKey === null) {
        return Promise.resolve(undefined)
      }
      return globalMutate(resolvedKey, data, {
        revalidate: shouldRevalidate !== false
      }) as Promise<Data | undefined>
    }
  }
}

export default useSwrEnhanced
