/**
 * @aiho/react 类型定义
 *
 * 该模块导出所有公共类型，方便用户直接导入使用。
 *
 * @example
 * ```ts
 * import type { SafeArea, DeviceType, UseDeviceOptions } from "@aiho/react/types";
 * ```
 *
 * @module
 */

// 导出 hooks 相关类型
export type { SafeArea } from './hooks/use-safe-area.ts'
export type { DeviceType, UseDeviceOptions } from './hooks/use-device.ts'
