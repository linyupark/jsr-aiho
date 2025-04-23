/**
 * 状态管理类型模块，定义了与状态管理相关的类型和接口。
 * 该模块包含状态数据的类型定义。
 *
 * @example
 * ```ts
 * import type { StateData } from "@aiho/hono/state/types";
 *
 * // 使用状态数据类型
 * const myStateData: StateData<{ redirectUri: string }> = {
 *   data: { redirectUri: "http://localhost:8000/callback" },
 *   createdAt: Date.now()
 * };
 * ```
 *
 * @module
 */

/**
 * 通用状态数据接口，允许存储任意类型的数据。
 * @template T 存储的数据类型
 */
export interface StateData<T = unknown> {
  /** 存储的数据 */
  data: T
  /** 创建时间戳（毫秒） */
  createdAt: number
}
