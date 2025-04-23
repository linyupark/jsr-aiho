/**
 * 设备检测 hook，用于检测当前设备类型和屏幕尺寸。
 * 该 hook 会根据用户代理和屏幕尺寸判断设备类型，并提供相关信息。
 * 支持自定义断点配置。
 *
 * @example
 * ```
 * import { useDevice } from '@aiho/react/hooks';
 *
 * // 使用默认配置
 * function App() {
 *   const { isMobile, deviceType } = useDevice();
 *
 *   return (
 *     <div>
 *       {isMobile ? '移动端布局' : '桌面端布局'}
 *       <p>设备类型: {deviceType}</p>
 *     </div>
 *   );
 * }
 *
 * // 使用自定义配置
 * function CustomApp() {
 *   const { isMobile, deviceType } = useDevice({
 *     mobileBreakpoint: 640
 *   });
 *
 *   return (
 *     <div>
 *       {isMobile ? '移动端布局' : '桌面端布局'}
 *       <p>设备类型: {deviceType}</p>
 *     </div>
 *   );
 * }
 * ```
 *
 * @param options 配置选项
 * @param options.mobileBreakpoint 移动设备断点宽度，默认为 768px
 * @returns 包含设备信息的对象
 * @property isMobile 是否为移动设备（基于屏幕尺寸）
 * @property deviceType 设备类型（基于用户代理）
 *
 * @module
 */

'use client'

import { useState, useEffect } from 'react'

/**
 * 设备类型枚举
 */
export type DeviceType = 'mobile' | 'desktop'

/**
 * useDevice hook 的配置选项
 */
export interface UseDeviceOptions {
  /**
   * 移动设备断点宽度，默认为 768px
   */
  mobileBreakpoint?: number
}

/**
 * 默认移动设备断点宽度
 */
const DEFAULT_MOBILE_BREAKPOINT = 768

/**
 * 设备检测 hook
 *
 * 该 hook 会根据用户代理和屏幕尺寸判断设备类型，并提供相关信息。
 * 可用于响应式布局和设备特定功能的实现。
 *
 * @param options 配置选项
 * @returns 包含设备信息的对象
 */
export function useDevice(options: UseDeviceOptions = {}) {
  const mobileBreakpoint = options.mobileBreakpoint ?? DEFAULT_MOBILE_BREAKPOINT

  const [isMobile, setIsMobile] = useState(false)
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop')

  useEffect(() => {
    const w: Window = window
    // 检测实际设备类型
    const checkDeviceType = () => {
      // 使用 navigator.userAgent 判断真实设备类型
      const isMobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      setDeviceType(isMobileDevice ? 'mobile' : 'desktop')
    }

    // 检测屏幕尺寸
    const checkScreenSize = () => {
      setIsMobile(w.innerWidth <= mobileBreakpoint)
    }

    checkDeviceType()
    checkScreenSize()

    w.addEventListener('resize', checkScreenSize)
    return () => w.removeEventListener('resize', checkScreenSize)
  }, [mobileBreakpoint])

  return {
    isMobile, // 用于响应式布局
    deviceType // 用于设备类型判断
  }
}
