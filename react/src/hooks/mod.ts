/**
 * React hooks 模块，提供各种实用的 React hooks。
 * 所有 hooks 都支持自定义配置，使其更加灵活。
 *
 * @example 使用默认配置
 * ```
 * import { useRem, useSafeArea, useDevice } from "@aiho/react/hooks";
 *
 * function App() {
 *   const { px2rem } = useRem();
 *   const safeArea = useSafeArea();
 *
 *   return (
 *     <div style={{
 *       // 默认配置下，16px 将根据屏幕宽度自动缩放
 *       // 但会限制在 12px-20px 的范围内
 *       fontSize: px2rem(16),
 *       paddingBottom: `${safeArea.bottom}px`
 *     }}>
 *       内容将根据屏幕大小自适应缩放，但保持可读性
 *     </div>
 *   );
 * }
 * ```
 *
 * @example 使用自定义配置
 * ```
 * import { useRem, useSafeArea, useDevice } from "@aiho/react/hooks";
 *
 * function CustomApp() {
 *   // 自定义 rem 单位转换配置
 *   const { px2rem } = useRem({
 *     baseWidth: 750,    // 设计稿基准宽度
 *     baseSize: 20,      // 基准字体大小
 *     minFontSize: 14,   // 最小字体限制
 *     maxFontSize: 24    // 最大字体限制
 *   });
 *
 *   // 自定义安全区域 CSS 变量名
 *   const safeArea = useSafeArea({
 *     cssVarNames: {
 *       top: '--safe-area-top',
 *       bottom: '--safe-area-bottom'
 *     }
 *   });
 *
 *   return (
 *     <div style={{
 *       // 在自定义配置下，字体大小将在 14px-24px 范围内缩放
 *       fontSize: px2rem(16),
 *       paddingBottom: `${safeArea.bottom}px`
 *     }}>
 *       内容将在自定义的字体范围内缩放
 *       <p style={{ fontSize: px2rem(12) }}>
 *         小字体也不会小于 14px，确保可读性
 *       </p>
 *       <h1 style={{ fontSize: px2rem(32) }}>
 *         大字体也不会超过 24px，保持布局稳定
 *       </h1>
 *     </div>
 *   );
 * }
 * ```
 *
 * @module
 */

export { useRem, px2rem, rem2px } from './use-rem.ts'
export type { UseRemOptions } from './use-rem.ts'

export { useSafeArea } from './use-safe-area.ts'
export type {
  SafeArea,
  CssVarNames,
  UseSafeAreaOptions
} from './use-safe-area.ts'

export { useDevice } from './use-device.ts'
export type { DeviceType, UseDeviceOptions } from './use-device.ts'

export { useWXSDK, getSearchParam } from './use-wxsdk.ts'
export type { WXSDKConfig, WXSDKResponse } from './use-wxsdk.ts'
