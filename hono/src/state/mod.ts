/**
 * 状态管理模块，提供了用于 OAuth 流程的状态管理功能。
 * 该模块导出状态的创建、获取、删除和清理功能，以确保 OAuth 流程的安全性。
 *
 * @example
 * ```ts
 * import { createState, getStateData, deleteStateData } from "@aiho/hono/state";
 *
 * // 创建状态
 * const state = createState({ redirectUri: "http://localhost:8000/callback" });
 *
 * // 获取状态数据
 * const stateData = getStateData<{ redirectUri: string }>(state);
 * if (stateData) {
 *   console.log(stateData.redirectUri); // http://localhost:8000/callback
 * }
 *
 * // 删除状态
 * deleteStateData(state);
 * ```
 *
 * @module
 */

export { createState, getStateData, deleteStateData, clearExpiredStateData } from './services.ts'
export type { StateData } from './types.ts'
