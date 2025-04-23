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
 *       fontSize: px2rem(16),
 *       paddingBottom: `${safeArea.bottom}px`
 *     }}>
 *       内容
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
 *     baseWidth: 750,
 *     baseSize: 20
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
 *       fontSize: px2rem(16),
 *       paddingBottom: `${safeArea.bottom}px`
 *     }}>
 *       内容
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
