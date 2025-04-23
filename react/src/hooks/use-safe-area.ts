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

import { useState, useEffect } from 'react'

/**
 * 安全区域接口
 */
export interface SafeArea {
  /** 顶部安全区域高度（像素） */
  top: number
  /** 右侧安全区域宽度（像素） */
  right: number
  /** 底部安全区域高度（像素） */
  bottom: number
  /** 左侧安全区域宽度（像素） */
  left: number
}

/**
 * CSS 变量名称接口
 */
export interface CssVarNames {
  /** 顶部安全区域 CSS 变量名 */
  top: string
  /** 右侧安全区域 CSS 变量名 */
  right: string
  /** 底部安全区域 CSS 变量名 */
  bottom: string
  /** 左侧安全区域 CSS 变量名 */
  left: string
}

/**
 * useSafeArea hook 的配置选项
 */
export interface UseSafeAreaOptions {
  /**
   * CSS 变量名称配置
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
  // 合并默认配置和用户配置
  const cssVarNames: CssVarNames = {
    ...DEFAULT_CSS_VAR_NAMES,
    ...options.cssVarNames
  }

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
