/**
 * rem 单位转换 hook，用于移动端适配。
 * 该 hook 会自动设置根元素字体大小，并提供 px 与 rem 之间的转换函数。
 * 支持自定义基准宽度和基准字体大小。
 *
 * @example
 * ```
 * import { useRem } from '@aiho/react/hooks';
 *
 * // 使用默认配置
 * function App() {
 *   const { px2rem, rem2px } = useRem();
 *
 *   return (
 *     <div style={{ fontSize: px2rem(16) }}>
 *       这段文字大小为 16px 对应的 rem 值
 *     </div>
 *   );
 * }
 *
 * // 使用自定义配置
 * function CustomApp() {
 *   const { px2rem, rem2px } = useRem({
 *     baseWidth: 750,
 *     baseSize: 20
 *   });
 *
 *   return (
 *     <div style={{ fontSize: px2rem(16) }}>
 *       这段文字大小为 16px 对应的 rem 值
 *     </div>
 *   );
 * }
 * ```
 *
 * @param options 配置选项
 * @param options.baseWidth 基准宽度，默认为 375px
 * @param options.baseSize 基准字体大小，默认为 16px
 * @returns 包含 px2rem 和 rem2px 转换函数的对象
 * @property px2rem 将像素值转换为 rem 字符串的函数
 * @property rem2px 将 rem 值转换为像素数值的函数
 *
 * @module
 */

import { useEffect } from 'react'

/**
 * 默认基准宽度 375px，用于计算缩放比例
 */
const DEFAULT_BASE_WIDTH = 375

/**
 * 默认基准字体大小 16px，用于 rem 单位转换
 */
const DEFAULT_BASE_SIZE = 16

/**
 * useRem hook 的配置选项
 */
export interface UseRemOptions {
  /**
   * 基准宽度，默认为 375px
   */
  baseWidth?: number
  /**
   * 基准字体大小，默认为 16px
   */
  baseSize?: number
  /**
   * 最小字体大小，默认为 12px
   */
  minFontSize?: number
  /**
   * 最大字体大小，默认为 20px
   */
  maxFontSize?: number
}

/**
 * 将像素值转换为 rem 字符串
 *
 * @param px 像素值
 * @param baseSize 基准字体大小，默认为 16px
 * @returns rem 字符串，如 "1.5rem"
 */
export function px2rem(
  px: number,
  baseSize: number = DEFAULT_BASE_SIZE
): string {
  return `${px / baseSize}rem`
}

/**
 * 将 rem 值转换为像素数值
 *
 * @param rem rem 值
 * @param baseSize 基准字体大小，默认为 16px
 * @returns 像素数值
 */
export function rem2px(
  rem: number,
  baseSize: number = DEFAULT_BASE_SIZE
): number {
  return rem * baseSize
}

/**
 * rem 单位转换 hook
 *
 * 该 hook 会根据屏幕宽度自动设置根元素字体大小，实现等比例缩放。
 * 同时提供 px 与 rem 之间的转换函数。
 *
 * @param options 配置选项
 * @returns 包含转换函数的对象
 */
export function useRem(options: UseRemOptions = {}): {
  px2rem: (px: number) => string
  rem2px: (rem: number) => number
} {
  const baseWidth = options.baseWidth ?? DEFAULT_BASE_WIDTH
  const baseSize = options.baseSize ?? DEFAULT_BASE_SIZE
  const minFontSize = options.minFontSize ?? 12
  const maxFontSize = options.maxFontSize ?? 20

  useEffect(() => {
    const setRem = () => {
      const width =
        document.documentElement.clientWidth || (window as Window).innerWidth
      const fontScale = width / baseWidth
      const fontSize = Math.min(
        Math.max(fontScale * baseSize, minFontSize),
        maxFontSize
      )
      document.documentElement.style.fontSize = `${fontSize}px`
    }

    // 初始设置
    setRem()

    // 监听窗口大小变化
    ;(window as Window).addEventListener('resize', setRem)

    // 清理函数
    return () => {
      ;(window as Window).removeEventListener('resize', setRem)
    }
  }, [baseWidth, baseSize, minFontSize, maxFontSize])

  return {
    // 使用闭包捕获当前的 baseSize 值
    px2rem: (px: number) => px2rem(px, baseSize),
    rem2px: (rem: number) => rem2px(rem, baseSize)
  }
}
