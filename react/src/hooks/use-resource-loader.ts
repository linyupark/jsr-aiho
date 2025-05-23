/**
 * 资源预加载 hook，用于预加载大量资源（如图片、音频、视频等）。
 * 该 hook 提供加载进度监控（0% 到 100%）和加载完成回调。
 * 支持并行加载多个资源以提高加载速度。
 * 支持自定义配置，如并发数、超时时间等。
 *
 * @example 基本用法
 * ```tsx
 * import { useResourceLoader } from '@aiho/react/hooks';
 *
 * function LoadingScreen() {
 *   const {
 *     progress,
 *     isLoading,
 *     isComplete,
 *     errors
 *   } = useResourceLoader({
 *     resources: [
 *       { type: 'image', url: '/images/background.jpg' },
 *       { type: 'image', url: '/images/logo.png' },
 *       { type: 'image', url: '/images/icon1.svg' },
 *       { type: 'image', url: '/images/icon2.svg' }
 *     ],
 *     onLoaded: () => {
 *       console.log('所有资源加载完成');
 *     }
 *   });
 *
 *   return (
 *     <div className="loading-screen">
 *       <div className="progress-bar">
 *         <div
 *           className="progress-fill"
 *           style={{ width: `${progress}%` }}
 *         />
 *       </div>
 *       <div className="progress-text">
 *         {isComplete ? '加载完成' : `加载中... ${Math.floor(progress)}%`}
 *       </div>
 *       {errors.length > 0 && (
 *         <div className="errors">
 *           加载以下资源时出错:
 *           <ul>
 *             {errors.map((error, index) => (
 *               <li key={index}>{error.url}: {error.message}</li>
 *             ))}
 *           </ul>
 *         </div>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example 自定义配置
 * ```tsx
 * import { useResourceLoader } from '@aiho/react/hooks';
 *
 * function AdvancedLoadingScreen() {
 *   const {
 *     progress,
 *     isLoading,
 *     isComplete,
 *     loadedCount,
 *     totalCount
 *   } = useResourceLoader({
 *     resources: [
 *       { type: 'image', url: '/images/large-image1.jpg' },
 *       { type: 'image', url: '/images/large-image2.jpg' },
 *       { type: 'audio', url: '/sounds/background-music.mp3' },
 *       { type: 'video', url: '/videos/intro.mp4' }
 *     ],
 *     concurrency: 2,           // 同时只加载2个资源
 *     timeout: 30000,           // 30秒超时
 *     retryCount: 3,            // 失败时重试3次
 *     retryDelay: 1000,         // 重试间隔1秒
 *     onProgress: (progress) => {
 *       console.log(`加载进度: ${progress}%`);
 *     },
 *     onLoaded: () => {
 *       console.log('所有资源加载完成');
 *     },
 *     onError: (error) => {
 *       console.error('资源加载错误:', error);
 *     }
 *   });
 *
 *   return (
 *     <div className="loading-screen">
 *       <div className="progress-details">
 *         已加载: {loadedCount}/{totalCount} 个资源
 *       </div>
 *       <div className="progress-bar">
 *         <div
 *           className="progress-fill"
 *           style={{ width: `${progress}%` }}
 *         />
 *       </div>
 *       <div className="progress-text">
 *         {isComplete ? '加载完成' : `加载中... ${Math.floor(progress)}%`}
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 *
 * @module
 */

import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * 资源类型
 *
 * 目前支持图片、音频和视频资源类型
 */
export type ResourceType = 'image' | 'audio' | 'video' | 'json' | 'text'

/**
 * 加载的资源类型联合
 */
export type LoadedResource =
  | HTMLImageElement
  | HTMLAudioElement
  | HTMLVideoElement
  | Record<string, unknown>
  | string

/**
 * 资源对象接口
 *
 * 定义了需要加载的资源的基本信息
 */
export interface Resource {
  /**
   * 资源类型
   */
  type: ResourceType

  /**
   * 资源URL
   */
  url: string

  /**
   * 资源权重，用于计算加载进度
   * 默认为1，权重越高，在总进度中占比越大
   */
  weight?: number

  /**
   * 资源标识符，可用于在加载完成后引用该资源
   * 如果未提供，将使用URL作为标识符
   */
  id?: string
}

/**
 * 资源加载错误接口
 */
export interface ResourceError {
  /**
   * 发生错误的资源URL
   */
  url: string

  /**
   * 错误消息
   */
  message: string

  /**
   * 资源标识符（如果有）
   */
  id?: string
}

/**
 * 资源加载配置选项
 */
export interface UseResourceLoaderOptions {
  /**
   * 要加载的资源列表
   */
  resources: Resource[]

  /**
   * 并发加载的资源数量
   * 默认为4
   */
  concurrency?: number

  /**
   * 资源加载超时时间（毫秒）
   * 默认为15000（15秒）
   */
  timeout?: number

  /**
   * 加载失败时的重试次数
   * 默认为1
   */
  retryCount?: number

  /**
   * 重试之间的延迟时间（毫秒）
   * 默认为500
   */
  retryDelay?: number

  /**
   * 是否自动开始加载
   * 默认为true
   */
  autoStart?: boolean

  /**
   * 加载进度回调函数
   * @param progress 当前加载进度（0-100）
   */
  onProgress?: (progress: number) => void

  /**
   * 所有资源加载完成时的回调函数
   * @param loadedResources 加载完成的资源对象
   */
  onLoaded?: (loadedResources: Record<string, LoadedResource>) => void

  /**
   * 资源加载错误时的回调函数
   * @param error 错误信息
   */
  onError?: (error: ResourceError) => void
}

/**
 * 资源加载状态接口
 */
export interface ResourceLoaderState {
  /**
   * 当前加载进度（0-100）
   */
  progress: number

  /**
   * 是否正在加载中
   */
  isLoading: boolean

  /**
   * 是否已完成所有资源加载
   */
  isComplete: boolean

  /**
   * 已加载的资源数量
   */
  loadedCount: number

  /**
   * 总资源数量
   */
  totalCount: number

  /**
   * 加载错误列表
   */
  errors: ResourceError[]

  /**
   * 已加载的资源对象
   * 可以通过资源ID或URL访问
   */
  loadedResources: Record<string, LoadedResource>

  /**
   * 开始加载资源
   * 如果已经在加载中，则不会重新开始
   */
  startLoading: () => void

  /**
   * 重置加载状态并重新开始加载
   */
  resetAndReload: () => void
}

/**
 * 加载单个图片资源
 *
 * @param url 图片URL
 * @param timeout 超时时间（毫秒）
 * @returns 加载完成的图片对象
 */
const loadImage = (url: string, timeout: number): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image()

    // 设置超时处理
    const timeoutId = setTimeout(() => {
      reject(new Error(`加载图片超时: ${url}`))
    }, timeout)

    img.onload = () => {
      clearTimeout(timeoutId)
      resolve(img)
    }

    img.onerror = () => {
      clearTimeout(timeoutId)
      reject(new Error(`加载图片失败: ${url}`))
    }

    img.src = url
  })
}

/**
 * 加载单个音频资源
 *
 * @param url 音频URL
 * @param timeout 超时时间（毫秒）
 * @returns 加载完成的音频对象
 */
const loadAudio = (url: string, timeout: number): Promise<HTMLAudioElement> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio()

    // 设置超时处理
    const timeoutId = setTimeout(() => {
      reject(new Error(`加载音频超时: ${url}`))
    }, timeout)

    audio.oncanplaythrough = () => {
      clearTimeout(timeoutId)
      resolve(audio)
    }

    audio.onerror = () => {
      clearTimeout(timeoutId)
      reject(new Error(`加载音频失败: ${url}`))
    }

    audio.src = url
    audio.load()
  })
}

/**
 * 加载单个视频资源
 *
 * @param url 视频URL
 * @param timeout 超时时间（毫秒）
 * @returns 加载完成的视频对象
 */
const loadVideo = (url: string, timeout: number): Promise<HTMLVideoElement> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')

    // 设置超时处理
    const timeoutId = setTimeout(() => {
      reject(new Error(`加载视频超时: ${url}`))
    }, timeout)

    video.oncanplaythrough = () => {
      clearTimeout(timeoutId)
      resolve(video)
    }

    video.onerror = () => {
      clearTimeout(timeoutId)
      reject(new Error(`加载视频失败: ${url}`))
    }

    video.src = url
    video.load()
  })
}

/**
 * 加载JSON资源
 *
 * @param url JSON文件URL
 * @param timeout 超时时间（毫秒）
 * @returns 解析后的JSON对象
 */
const loadJSON = async (
  url: string,
  timeout: number
): Promise<Record<string, unknown>> => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, { signal: controller.signal })
    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`加载JSON失败: ${response.status} ${response.statusText}`)
    }

    return (await response.json()) as Record<string, unknown>
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`加载JSON超时: ${url}`)
    }
    throw error
  }
}

/**
 * 加载文本资源
 *
 * @param url 文本文件URL
 * @param timeout 超时时间（毫秒）
 * @returns 文本内容
 */
const loadText = async (url: string, timeout: number): Promise<string> => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, { signal: controller.signal })
    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`加载文本失败: ${response.status} ${response.statusText}`)
    }

    return await response.text()
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`加载文本超时: ${url}`)
    }
    throw error
  }
}

/**
 * 根据资源类型加载单个资源
 *
 * @param resource 资源对象
 * @param timeout 超时时间（毫秒）
 * @returns 加载完成的资源
 */
const loadResource = async (
  resource: Resource,
  timeout: number
): Promise<LoadedResource> => {
  const { type, url } = resource

  switch (type) {
    case 'image':
      return await loadImage(url, timeout)
    case 'audio':
      return await loadAudio(url, timeout)
    case 'video':
      return await loadVideo(url, timeout)
    case 'json':
      return await loadJSON(url, timeout)
    case 'text':
      return await loadText(url, timeout)
    default:
      throw new Error(`不支持的资源类型: ${type}`)
  }
}

/**
 * 带重试功能的资源加载函数
 *
 * @param resource 资源对象
 * @param timeout 超时时间（毫秒）
 * @param retryCount 重试次数
 * @param retryDelay 重试延迟（毫秒）
 * @returns 加载完成的资源
 */
const loadResourceWithRetry = async (
  resource: Resource,
  timeout: number,
  retryCount: number,
  retryDelay: number
): Promise<LoadedResource> => {
  let lastError = new Error(`加载资源失败: ${resource.url}`)

  for (let attempt = 0; attempt <= retryCount; attempt++) {
    try {
      return await loadResource(resource, timeout)
    } catch (error: unknown) {
      if (error instanceof Error) {
        lastError = error
      } else {
        lastError = new Error(`未知错误: ${String(error)}`)
      }

      if (attempt < retryCount) {
        // 等待指定时间后重试
        await new Promise((resolve) => setTimeout(resolve, retryDelay))
      }
    }
  }

  throw lastError
}

/**
 * 资源预加载 hook
 *
 * 该 hook 用于预加载大量资源（如图片、音频、视频等），并提供加载进度监控和完成回调。
 * 支持并行加载多个资源以提高加载速度，可自定义并发数、超时时间等配置。
 *
 * @param options 资源加载配置选项
 * @returns 资源加载状态
 */
export function useResourceLoader(
  options: UseResourceLoaderOptions
): ResourceLoaderState {
  const {
    resources,
    concurrency = 4,
    timeout = 15000,
    retryCount = 1,
    retryDelay = 500,
    autoStart = true,
    onProgress,
    onLoaded,
    onError
  } = options

  // 计算总权重
  const totalWeight = resources.reduce(
    (sum, resource) => sum + (resource.weight || 1),
    0
  )

  // 状态
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [loadedCount, setLoadedCount] = useState(0)
  const [errors, setErrors] = useState<ResourceError[]>([])
  const [loadedResources, setLoadedResources] = useState<
    Record<string, LoadedResource>
  >({})

  // 使用 ref 存储队列和进度信息，避免闭包问题
  const queueRef = useRef<Resource[]>([])
  const loadingRef = useRef<Set<string>>(new Set())
  const completedWeightRef = useRef(0)

  // 重置所有状态
  const resetState = useCallback(() => {
    setProgress(0)
    setIsLoading(false)
    setIsComplete(false)
    setLoadedCount(0)
    setErrors([])
    setLoadedResources({})
    queueRef.current = [...resources]
    loadingRef.current = new Set()
    completedWeightRef.current = 0
  }, [resources])

  // 处理单个资源加载
  const processResource = useCallback(
    async (resource: Resource) => {
      const { url, id = url, weight = 1 } = resource

      // 标记为正在加载
      loadingRef.current.add(url)

      try {
        // 加载资源
        const loadedResource = await loadResourceWithRetry(
          resource,
          timeout,
          retryCount,
          retryDelay
        )

        // 更新已加载资源，使用函数式更新确保使用最新状态
        setLoadedResources((prev: Record<string, LoadedResource>) => {
          const updated = {
            ...prev,
            [id]: loadedResource,
            [url]: loadedResource
          }
          return updated
        })

        // 更新加载计数
        setLoadedCount((prev: number) => prev + 1)

        // 更新已完成权重和进度
        completedWeightRef.current += weight
        const newProgress = (completedWeightRef.current / totalWeight) * 100
        setProgress(newProgress)

        // 调用进度回调
        onProgress?.(newProgress)
      } catch (error: unknown) {
        // 处理错误
        const errorMessage =
          error instanceof Error ? error.message : String(error)

        const resourceError: ResourceError = {
          url,
          id,
          message: errorMessage || '未知错误'
        }

        setErrors((prev: ResourceError[]) => [...prev, resourceError])
        onError?.(resourceError)
      } finally {
        // 从加载集合中移除
        loadingRef.current.delete(url)

        // 检查是否所有资源都已处理
        const allProcessed =
          queueRef.current.length === 0 && loadingRef.current.size === 0

        if (allProcessed) {
          setIsLoading(false)
          setIsComplete(true)
          // 使用函数形式获取最新的loadedResources状态
          setLoadedResources(
            (currentLoadedResources: Record<string, LoadedResource>) => {
              // 在状态更新完成后调用onLoaded回调
              setTimeout(() => onLoaded?.(currentLoadedResources), 0)
              return currentLoadedResources
            }
          )
        } else {
          // 继续处理队列中的下一个资源
          processNextResource()
        }
      }
    },
    [timeout, retryCount, retryDelay, totalWeight, onProgress, onError]
  )

  // 处理队列中的下一个资源
  const processNextResource = useCallback(() => {
    // 如果队列为空或已达到并发上限，则不处理
    if (
      queueRef.current.length === 0 ||
      loadingRef.current.size >= concurrency
    ) {
      return
    }

    // 从队列中取出下一个资源
    const nextResource = queueRef.current.shift()
    if (nextResource) {
      processResource(nextResource)
    }
  }, [concurrency, processResource])

  // 开始加载资源
  const startLoading = useCallback(() => {
    if (isLoading || isComplete || resources.length === 0) {
      return
    }

    setIsLoading(true)

    // 初始化队列
    queueRef.current = [...resources]

    // 开始处理资源，最多同时处理 concurrency 个
    const initialBatch = Math.min(concurrency, resources.length)
    for (let i = 0; i < initialBatch; i++) {
      processNextResource()
    }
  }, [isLoading, isComplete, resources, concurrency, processNextResource])

  // 重置并重新加载
  const resetAndReload = useCallback(() => {
    resetState()
    // 使用 setTimeout 确保状态重置后再开始加载
    // 增加延迟时间，确保状态完全更新
    setTimeout(() => {
      setIsLoading(true)

      // 开始处理资源，最多同时处理 concurrency 个
      const initialBatch = Math.min(concurrency, resources.length)
      for (let i = 0; i < initialBatch; i++) {
        processNextResource()
      }
    }, 50) // 增加延迟时间
  }, [resetState, concurrency, resources.length, processNextResource])

  // 使用ref跟踪是否已经初始化，避免重复执行
  const isInitialMount = useRef(true)

  // 自动开始加载
  useEffect(() => {
    if (isInitialMount.current && autoStart) {
      isInitialMount.current = false
      resetState()
      // 使用setTimeout确保状态更新后再开始加载
      setTimeout(() => {
        startLoading()
      }, 0)
    }

    return () => {
      // 清理工作（如果需要）
    }
  }, [])

  return {
    progress,
    isLoading,
    isComplete,
    loadedCount,
    totalCount: resources.length,
    errors,
    loadedResources,
    startLoading,
    resetAndReload
  }
}
