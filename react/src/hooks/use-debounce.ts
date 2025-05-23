'use client'

import { useState, useEffect, useRef } from 'react'

/**
 * 防抖 Hook，用于延迟执行函数，避免频繁触发
 *
 * @param value 需要防抖的值
 * @param delay 延迟时间，单位毫秒，默认300ms
 * @returns 防抖后的值
 *
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 *
 * // 使用debouncedSearchTerm进行搜索操作
 * useEffect(() => {
 *   if (debouncedSearchTerm) {
 *     // 执行搜索操作
 *   }
 * }, [debouncedSearchTerm]);
 * ```
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // 设置定时器
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // 清除定时器
    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * 防抖函数 Hook，用于延迟执行回调函数
 *
 * @param fn 需要防抖的回调函数
 * @param delay 延迟时间，单位毫秒，默认300ms
 * @returns 防抖后的回调函数
 *
 * @example
 * ```tsx
 * const handleSearch = useDebounceCallback((value: string) => {
 *   // 执行搜索操作
 *   console.log('搜索:', value);
 * }, 500);
 *
 * // 直接调用handleSearch，它会自动防抖
 * const onChange = (e) => {
 *   handleSearch(e.target.value);
 * };
 * ```
 */
export function useDebounceCallback<
  T extends (...args: Parameters<T>) => string | number | void
>(fn: T, delay: number = 300): (...args: Parameters<T>) => void {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  return (...args: Parameters<T>) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    timerRef.current = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}
