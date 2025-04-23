/**
 * @aiho/react 是一个 React 实用工具集，提供移动端适配、安全区域处理等功能。
 * 该模块导出所有主要功能，包括 hooks 和组件。
 *
 * @example 使用 rem 单位转换 hook
 *
 * ```
 * // 使用默认配置
 * import { useRem } from "@aiho/react";
 *
 * function App() {
 *   const { px2rem } = useRem();
 *
 *   return (
 *     <div style={{ fontSize: px2rem(16) }}>
 *       这段文字大小为 16px 对应的 rem 值
 *     </div>
 *   );
 * }
 *
 * // 使用自定义配置
 * import { useRem } from "@aiho/react";
 *
 * function CustomApp() {
 *   const { px2rem } = useRem({
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
 * @module
 */

// 导出 hooks
export { useRem, px2rem, rem2px } from './src/hooks/use-rem.ts'
export type { UseRemOptions } from './src/hooks/use-rem.ts'

export { useSafeArea } from './src/hooks/use-safe-area.ts'
export type {
  SafeArea,
  CssVarNames,
  UseSafeAreaOptions
} from './src/hooks/use-safe-area.ts'

export { useDevice } from './src/hooks/use-device.ts'
export type { DeviceType, UseDeviceOptions } from './src/hooks/use-device.ts'
