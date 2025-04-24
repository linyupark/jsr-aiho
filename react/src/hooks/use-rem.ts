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
 * 该函数用于将设计稿中的像素值转换为响应式的 rem 单位。
 * 在移动端开发中，使用 rem 单位可以实现不同屏幕尺寸下的等比例缩放。
 *
 * @param px 像素值，通常来自设计稿中的尺寸
 * @param baseSize 基准字体大小，默认为 16px，与 HTML 根元素的字体大小对应
 * @returns rem 字符串，格式为 "数值rem"，如 "1.5rem"
 *
 * @example 基本用法
 * ```tsx
 * import { px2rem } from "@aiho/react/hooks";
 *
 * // 将 16px 转换为 rem
 * const fontSize = px2rem(16); // "1rem"
 *
 * // 在样式中使用
 * const style = {
 *   fontSize: px2rem(16),
 *   padding: px2rem(20),
 *   margin: `${px2rem(10)} ${px2rem(15)}`
 * };
 * ```
 *
 * @example 自定义基准字体大小
 * ```tsx
 * import { px2rem } from "@aiho/react/hooks";
 *
 * // 使用 20px 作为基准字体大小
 * const fontSize = px2rem(20, 20); // "1rem"
 * const padding = px2rem(40, 20); // "2rem"
 * ```
 *
 * @example 与 useRem hook 结合使用
 * ```tsx
 * import { useRem } from "@aiho/react/hooks";
 *
 * function App() {
 *   // useRem 返回的 px2rem 已经绑定了配置中的 baseSize
 *   const { px2rem } = useRem({ baseSize: 20 });
 *
 *   return (
 *     <div style={{
 *       fontSize: px2rem(16), // 使用 20 作为基准，结果为 "0.8rem"
 *       padding: px2rem(20)   // 使用 20 作为基准，结果为 "1rem"
 *     }}>
 *       响应式文本
 *     </div>
 *   );
 * }
 * ```
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
 * 该函数用于将 rem 单位转换回像素值，通常用于计算或调试。
 * 这是 px2rem 函数的反向操作。
 *
 * @param rem rem 值，不包含单位，例如 1.5（表示 1.5rem）
 * @param baseSize 基准字体大小，默认为 16px，与 HTML 根元素的字体大小对应
 * @returns 像素数值，不包含单位，例如 24（表示 24px）
 *
 * @example 基本用法
 * ```tsx
 * import { rem2px } from "@aiho/react/hooks";
 *
 * // 将 1rem 转换为像素值
 * const pixels = rem2px(1); // 16
 *
 * // 将 1.5rem 转换为像素值
 * const pixels = rem2px(1.5); // 24
 * ```
 *
 * @example 自定义基准字体大小
 * ```tsx
 * import { rem2px } from "@aiho/react/hooks";
 *
 * // 使用 20px 作为基准字体大小
 * const pixels = rem2px(1, 20); // 20
 * const pixels = rem2px(2, 20); // 40
 * ```
 *
 * @example 与 useRem hook 结合使用
 * ```tsx
 * import { useRem } from "@aiho/react/hooks";
 *
 * function App() {
 *   // useRem 返回的 rem2px 已经绑定了配置中的 baseSize
 *   const { rem2px } = useRem({ baseSize: 20 });
 *
 *   // 计算元素实际像素尺寸
 *   const actualHeight = rem2px(2); // 使用 20 作为基准，结果为 40
 *
 *   return (
 *     <div>
 *       该元素的高度为 {actualHeight}px
 *     </div>
 *   );
 * }
 * ```
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
 * 同时提供 px 与 rem 之间的转换函数，便于在 React 组件中使用。
 *
 * 工作原理：
 * 1. 监听窗口大小变化，根据当前屏幕宽度和基准宽度计算缩放比例
 * 2. 根据缩放比例设置 HTML 根元素的字体大小，但限制在最小和最大字体大小范围内
 * 3. 提供 px2rem 和 rem2px 函数，用于在组件中进行单位转换
 *
 * @param options 配置选项，用于自定义 rem 单位转换的行为
 * @param options.baseWidth 基准宽度，默认为 375px，通常是设计稿的宽度
 * @param options.baseSize 基准字体大小，默认为 16px，与 HTML 根元素的字体大小对应
 * @param options.minFontSize 最小字体大小，默认为 12px，确保在小屏幕上文字仍然可读
 * @param options.maxFontSize 最大字体大小，默认为 20px，确保在大屏幕上文字不会过大
 *
 * @returns 包含转换函数的对象
 * @returns.px2rem 将像素值转换为 rem 字符串的函数，已绑定配置中的 baseSize
 * @returns.rem2px 将 rem 值转换为像素数值的函数，已绑定配置中的 baseSize
 *
 * @example 基本用法
 * ```tsx
 * import { useRem } from "@aiho/react/hooks";
 *
 * function App() {
 *   const { px2rem } = useRem();
 *
 *   return (
 *     <div style={{
 *       fontSize: px2rem(16),
 *       padding: px2rem(20),
 *       margin: px2rem(10)
 *     }}>
 *       这段文字会根据屏幕宽度自动缩放
 *     </div>
 *   );
 * }
 * ```
 *
 * @example 自定义配置
 * ```tsx
 * import { useRem } from "@aiho/react/hooks";
 *
 * function App() {
 *   // 使用自定义配置
 *   const { px2rem } = useRem({
 *     baseWidth: 750,     // 设计稿宽度为 750px
 *     baseSize: 32,       // 基准字体大小为 32px
 *     minFontSize: 16,    // 最小字体大小为 16px
 *     maxFontSize: 48     // 最大字体大小为 48px
 *   });
 *
 *   return (
 *     <div style={{ fontSize: px2rem(32) }}>
 *       使用自定义配置的响应式文本
 *     </div>
 *   );
 * }
 * ```
 *
 * @example 在组件库中使用
 * ```tsx
 * import { useRem } from "@aiho/react/hooks";
 *
 * // 创建一个响应式按钮组件
 * function ResponsiveButton({ children, ...props }) {
 *   const { px2rem } = useRem();
 *
 *   const buttonStyle = {
 *     fontSize: px2rem(16),
 *     padding: `${px2rem(8)} ${px2rem(16)}`,
 *     borderRadius: px2rem(4),
 *     // 其他样式...
 *   };
 *
 *   return (
 *     <button style={buttonStyle} {...props}>
 *       {children}
 *     </button>
 *   );
 * }
 * ```
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
