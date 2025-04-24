/**
 * 安全区域 hook，用于处理移动设备的安全区域。
 * 该 hook 会自动设置安全区域相关的 CSS 变量，并提供安全区域的尺寸信息。
 * 支持自定义 CSS 变量名称。
 *
 * @example
 * ```
 * import { useSafeArea } from '@aiho/react/hooks';
 *
 * // 使用默认配置
 * function App() {
 *   const safeArea = useSafeArea();
 *
 *   return (
 *     <div style={{
 *       paddingTop: `${safeArea.top}px`,
 *       paddingBottom: `${safeArea.bottom}px`
 *     }}>
 *       内容将避开顶部和底部的安全区域
 *     </div>
 *   );
 * }
 *
 * // 使用自定义配置
 * function CustomApp() {
 *   const safeArea = useSafeArea({
 *     cssVarNames: {
 *       top: '--safe-area-top',
 *       right: '--safe-area-right',
 *       bottom: '--safe-area-bottom',
 *       left: '--safe-area-left'
 *     }
 *   });
 *
 *   return (
 *     <div style={{
 *       paddingTop: `${safeArea.top}px`,
 *       paddingBottom: `${safeArea.bottom}px`
 *     }}>
 *       内容将避开顶部和底部的安全区域
 *     </div>
 *   );
 * }
 * ```
 *
 * @param options 配置选项
 * @param options.cssVarNames CSS 变量名称配置，默认为 { top: '--sat', right: '--sar', bottom: '--sab', left: '--sal' }
 * @returns 包含安全区域尺寸的对象
 * @property top 顶部安全区域高度（像素）
 * @property right 右侧安全区域宽度（像素）
 * @property bottom 底部安全区域高度（像素）
 * @property left 左侧安全区域宽度（像素）
 *
 * @module
 */

import { useState, useEffect, useMemo } from 'react'

/**
 * 安全区域接口
 *
 * 该接口定义了设备安全区域的尺寸信息，包括顶部、右侧、底部和左侧的安全区域大小。
 * 安全区域是指设备屏幕上不被刘海、圆角、底部操作条等遮挡的可视区域。
 *
 * @example
 * ```ts
 * import { useSafeArea, type SafeArea } from "@aiho/react/hooks";
 *
 * function SafeAreaAwareComponent() {
 *   const safeArea = useSafeArea();
 *
 *   // 使用安全区域信息设置内边距
 *   const containerStyle = {
 *     paddingTop: `${safeArea.top}px`,
 *     paddingRight: `${safeArea.right}px`,
 *     paddingBottom: `${safeArea.bottom}px`,
 *     paddingLeft: `${safeArea.left}px`
 *   };
 *
 *   return <div style={containerStyle}>内容将避开安全区域</div>;
 * }
 * ```
 *
 * @example 仅使用底部安全区域
 * ```ts
 * import { useSafeArea } from "@aiho/react/hooks";
 *
 * function BottomNavigation() {
 *   const { bottom } = useSafeArea();
 *
 *   return (
 *     <nav style={{
 *       position: 'fixed',
 *       bottom: 0,
 *       left: 0,
 *       right: 0,
 *       paddingBottom: `${bottom}px`
 *     }}>
 *       底部导航栏（避开底部安全区域）
 *     </nav>
 *   );
 * }
 * ```
 */
export interface SafeArea {
  /**
   * 顶部安全区域高度（像素）
   *
   * 在 iOS 设备上，这通常对应于顶部刘海或状态栏的高度。
   * 在没有刘海的设备上，这个值通常为 0。
   */
  top: number

  /**
   * 右侧安全区域宽度（像素）
   *
   * 在某些设备上，屏幕右侧可能有圆角或缺口，这个值表示右侧需要避开的区域宽度。
   * 在大多数设备上，这个值通常为 0。
   */
  right: number

  /**
   * 底部安全区域高度（像素）
   *
   * 在 iOS 设备上，这通常对应于底部操作条（Home Indicator）的高度。
   * 在 Android 设备上，这可能对应于导航栏的高度。
   * 这个值在全面屏手机上尤为重要。
   */
  bottom: number

  /**
   * 左侧安全区域宽度（像素）
   *
   * 在某些设备上，屏幕左侧可能有圆角或缺口，这个值表示左侧需要避开的区域宽度。
   * 在大多数设备上，这个值通常为 0。
   */
  left: number
}

/**
 * CSS 变量名称接口
 *
 * 该接口定义了安全区域相关的 CSS 变量名称。
 * 这些 CSS 变量将被设置在 HTML 根元素上，可以在 CSS 中直接使用。
 *
 * @example 在 CSS 中使用安全区域变量
 * ```css
 * .safe-container {
 *   padding-top: var(--sat, 0px);
 *   padding-right: var(--sar, 0px);
 *   padding-bottom: var(--sab, 0px);
 *   padding-left: var(--sal, 0px);
 * }
 *
 * .bottom-nav {
 *   position: fixed;
 *   bottom: 0;
 *   left: 0;
 *   right: 0;
 *   padding-bottom: var(--sab, 0px);
 * }
 * ```
 *
 * @example 自定义 CSS 变量名
 * ```ts
 * import { useSafeArea } from "@aiho/react/hooks";
 *
 * // 使用自定义 CSS 变量名
 * useSafeArea({
 *   cssVarNames: {
 *     top: '--safe-area-top',
 *     bottom: '--safe-area-bottom'
 *   }
 * });
 *
 * // 然后在 CSS 中使用自定义变量名
 * // .container { padding-top: var(--safe-area-top, 0px); }
 * ```
 */
export interface CssVarNames {
  /**
   * 顶部安全区域 CSS 变量名
   *
   * 默认值为 '--sat'，可以在 CSS 中通过 var(--sat) 使用。
   * 这个变量存储的是顶部安全区域的高度（像素）。
   */
  top: string

  /**
   * 右侧安全区域 CSS 变量名
   *
   * 默认值为 '--sar'，可以在 CSS 中通过 var(--sar) 使用。
   * 这个变量存储的是右侧安全区域的宽度（像素）。
   */
  right: string

  /**
   * 底部安全区域 CSS 变量名
   *
   * 默认值为 '--sab'，可以在 CSS 中通过 var(--sab) 使用。
   * 这个变量存储的是底部安全区域的高度（像素）。
   * 在全面屏手机上，这个值通常对应于底部操作条的高度。
   */
  bottom: string

  /**
   * 左侧安全区域 CSS 变量名
   *
   * 默认值为 '--sal'，可以在 CSS 中通过 var(--sal) 使用。
   * 这个变量存储的是左侧安全区域的宽度（像素）。
   */
  left: string
}

/**
 * useSafeArea hook 的配置选项
 *
 * 该接口定义了 useSafeArea hook 的配置参数，允许自定义 CSS 变量名称。
 *
 * @example
 * ```ts
 * import { useSafeArea } from "@aiho/react/hooks";
 *
 * // 使用自定义 CSS 变量名
 * const safeArea = useSafeArea({
 *   cssVarNames: {
 *     top: '--safe-top',
 *     right: '--safe-right',
 *     bottom: '--safe-bottom',
 *     left: '--safe-left'
 *   }
 * });
 * ```
 */
export interface UseSafeAreaOptions {
  /**
   * CSS 变量名称配置
   *
   * 可以自定义安全区域相关的 CSS 变量名称。
   * 只需要提供要自定义的变量名，未提供的将使用默认值。
   *
   * 默认值：
   * - top: '--sat'
   * - right: '--sar'
   * - bottom: '--sab'
   * - left: '--sal'
   */
  cssVarNames?: Partial<CssVarNames>
}

/**
 * 默认 CSS 变量名称
 */
const DEFAULT_CSS_VAR_NAMES: CssVarNames = {
  top: '--sat',
  right: '--sar',
  bottom: '--sab',
  left: '--sal'
}

/**
 * 安全区域 hook
 *
 * 该 hook 会自动设置安全区域相关的 CSS 变量，并提供安全区域的尺寸信息。
 * 默认 CSS 变量名称为：--sat, --sar, --sab, --sal，可通过配置选项自定义。
 *
 * @param options 配置选项
 * @returns 包含安全区域尺寸的对象
 */
export function useSafeArea(options: UseSafeAreaOptions = {}): SafeArea {
  // 使用 useMemo 缓存 cssVarNames 对象，避免每次渲染时创建新对象
  const cssVarNames = useMemo<CssVarNames>(
    () => ({
      ...DEFAULT_CSS_VAR_NAMES,
      ...options.cssVarNames
    }),
    [options.cssVarNames]
  )

  const [safeArea, setSafeArea] = useState<SafeArea>({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  })

  useEffect(() => {
    const updateSafeArea = () => {
      const computedStyle = getComputedStyle(document.documentElement)

      setSafeArea({
        top: parseInt(
          computedStyle.getPropertyValue(cssVarNames.top) || '0',
          10
        ),
        right: parseInt(
          computedStyle.getPropertyValue(cssVarNames.right) || '0',
          10
        ),
        bottom: parseInt(
          computedStyle.getPropertyValue(cssVarNames.bottom) || '0',
          10
        ),
        left: parseInt(
          computedStyle.getPropertyValue(cssVarNames.left) || '0',
          10
        )
      })
    }

    // 初始化 CSS 变量
    document.documentElement.style.setProperty(
      cssVarNames.top,
      'env(safe-area-inset-top, 0px)'
    )
    document.documentElement.style.setProperty(
      cssVarNames.right,
      'env(safe-area-inset-right, 0px)'
    )
    document.documentElement.style.setProperty(
      cssVarNames.bottom,
      'env(safe-area-inset-bottom, 0px)'
    )
    document.documentElement.style.setProperty(
      cssVarNames.left,
      'env(safe-area-inset-left, 0px)'
    )

    // 初始更新
    updateSafeArea()

    // 监听窗口大小变化
    ;(window as Window).addEventListener('resize', updateSafeArea)

    // 清理函数
    return () => {
      ;(window as Window).removeEventListener('resize', updateSafeArea)
    }
  }, [cssVarNames])

  return safeArea
}
