/**
 * 设备检测 hook，用于检测当前设备类型和屏幕尺寸。
 * 该 hook 会根据用户代理和屏幕尺寸判断设备类型，并提供相关信息。
 * 支持自定义断点配置。
 * 提供 isDetecting 状态标记，便于在检测完成前显示加载状态。
 *
 * @example
 * ```
 * import { useDevice } from '@aiho/react/hooks';
 *
 * // 使用默认配置
 * function App() {
 *   const { isMobile, deviceType, isDetecting } = useDevice();
 *
 *   if (isDetecting) {
 *     return <div>正在检测设备信息...</div>;
 *   }
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
 *   const { isMobile, deviceType, isDetecting } = useDevice({
 *     mobileBreakpoint: 640
 *   });
 *
 *   return (
 *     <div>
 *       {isDetecting ? '正在检测...' :
 *         isMobile ? '移动端布局' : '桌面端布局'}
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
 * @property isDetecting 是否正在检测设备信息
 *
 * @module
 */

'use client'

import { useState, useEffect } from 'react'

/**
 * 设备类型枚举
 *
 * 该类型用于表示设备的类型，基于用户代理（User Agent）检测。
 * 在响应式设计中，可以根据设备类型提供不同的交互体验。
 *
 * @example
 * ```ts
 * import { useDevice, type DeviceType } from "@aiho/react/hooks";
 *
 * function DeviceSpecificFeature() {
 *   const { deviceType } = useDevice();
 *
 *   // 根据设备类型渲染不同的组件
 *   if (deviceType === 'mobile') {
 *     return <div>移动设备优化界面</div>;
 *   } else {
 *     return <div>桌面设备优化界面</div>;
 *   }
 * }
 * ```
 */
export type DeviceType = 'mobile' | 'desktop'

/**
 * useDevice hook 的配置选项
 *
 * 该接口定义了 useDevice hook 的配置参数，允许自定义设备检测的行为。
 * 通过这些选项，可以根据项目需求调整移动设备的断点宽度。
 *
 * @example 基本用法
 * ```ts
 * import { useDevice } from "@aiho/react/hooks";
 *
 * // 使用默认配置（移动设备断点为 768px）
 * function App() {
 *   const { isMobile } = useDevice();
 *   return <div>{isMobile ? '移动版' : '桌面版'}</div>;
 * }
 * ```
 *
 * @example 自定义断点
 * ```ts
 * import { useDevice } from "@aiho/react/hooks";
 *
 * // 自定义移动设备断点为 640px（适合小屏幕优先的设计）
 * function App() {
 *   const { isMobile } = useDevice({ mobileBreakpoint: 640 });
 *
 *   // 根据屏幕尺寸应用不同的样式类
 *   const layoutClass = isMobile ? 'mobile-layout' : 'desktop-layout';
 *
 *   return (
 *     <div className={layoutClass}>
 *       {isMobile ? '小屏幕布局' : '大屏幕布局'}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example 与 CSS 媒体查询结合
 * ```ts
 * import { useDevice } from "@aiho/react/hooks";
 *
 * // 确保 JS 和 CSS 使用相同的断点
 * const BREAKPOINTS = {
 *   mobile: 576,
 *   tablet: 768,
 *   desktop: 992,
 *   largeDesktop: 1200
 * };
 *
 * function ResponsiveLayout() {
 *   // 使用与 CSS 相同的断点
 *   const { isMobile } = useDevice({
 *     mobileBreakpoint: BREAKPOINTS.tablet
 *   });
 *
 *   // 在 CSS 中可以使用相同的断点:
 *   // @media (max-width: 768px) { ... }
 *
 *   return (
 *     <div>
 *       {isMobile ? '移动导航' : '桌面导航'}
 *     </div>
 *   );
 * }
 * ```
 */
export interface UseDeviceOptions {
  /**
   * 移动设备断点宽度，默认为 768px
   *
   * 当屏幕宽度小于或等于此值时，`isMobile` 属性将为 true。
   * 这个值应该与您的 CSS 媒体查询断点保持一致，以确保 JS 和 CSS 的行为一致。
   *
   * 常见的断点值：
   * - 576px: 小型移动设备（竖屏手机）
   * - 768px: 平板设备和大型手机（横屏）
   * - 992px: 小型桌面显示器
   * - 1200px: 大型桌面显示器
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
 * 提供 isDetecting 状态，便于在检测完成前显示加载状态。
 *
 * @param options 配置选项
 * @returns 包含设备信息的对象
 */
export function useDevice(options: UseDeviceOptions = {}): {
  isMobile: boolean
  deviceType: DeviceType
  isDetecting: boolean
} {
  const mobileBreakpoint = options.mobileBreakpoint ?? DEFAULT_MOBILE_BREAKPOINT

  // 添加 isDetecting 状态，表示是否正在检测中
  const [isDetecting, setIsDetecting] = useState(true)
  // 初始状态设为 null，表示尚未检测
  const [isMobile, setIsMobile] = useState<boolean | null>(null)
  const [deviceType, setDeviceType] = useState<DeviceType | null>(null)

  useEffect(() => {
    // 确保代码只在客户端执行
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return
    }

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
      setIsMobile(globalThis.innerWidth <= mobileBreakpoint)
    }

    // 执行检测
    checkDeviceType()
    checkScreenSize()
    // 检测完成
    setIsDetecting(false)

    // 监听窗口大小变化
    globalThis.addEventListener('resize', checkScreenSize)
    return () => globalThis.removeEventListener('resize', checkScreenSize)
  }, [mobileBreakpoint])

  return {
    // 如果尚未检测完成，默认为非移动设备，但提供 isDetecting 标志
    isMobile: isMobile === null ? false : isMobile, // 用于响应式布局
    deviceType: deviceType === null ? 'desktop' : deviceType, // 用于设备类型判断
    isDetecting // 指示是否正在检测中
  }
}
