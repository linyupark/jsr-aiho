/**
 * 状态管理模块，提供了用于 OAuth 流程的状态管理功能。
 * 该模块实现了状态的创建、获取、删除和清理功能，以确保 OAuth 流程的安全性。
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

import type { StateData } from './types.ts'

/** 使用 Map 存储 state，键是 state 字符串，值是包含数据和创建时间戳的对象 */
const stateStore = new Map<string, StateData>()

/** state 有效期（例如：10分钟，以毫秒为单位） */
const STATE_EXPIRATION_MS: number = 10 * 60 * 1000

/**
 * 清理过期的 state
 * 该函数会遍历所有存储的 state，并删除那些超过有效期的 state
 *
 * @returns void
 *
 * @example
 * ```ts
 * import { clearExpiredStateData } from "@aiho/hono/state";
 *
 * // 清理过期的 state
 * clearExpiredStateData();
 * ```
 */
export const clearExpiredStateData = (): void => {
  const now = Date.now()
  for (const [state, stateData] of stateStore.entries()) {
    if (now - stateData.createdAt > STATE_EXPIRATION_MS) {
      stateStore.delete(state)
      console.log(`Expired state removed: ${state}`)
    }
  }
}

/**
 * 创建一个新的 state 并存储关联的数据
 * 该函数生成一个唯一的 state 字符串，并将其与提供的数据关联起来
 * 在创建新 state 前，会自动清理过期的 state
 *
 * @template T 存储的数据类型
 * @param data 要与 state 关联的数据
 * @returns 生成的 state 字符串，可用于后续的验证
 *
 * @example
 * ```ts
 * import { createState } from "@aiho/hono/state";
 *
 * // 创建一个包含重定向 URL 的 state
 * const state = createState({ redirectUri: "http://localhost:8000/callback" });
 * console.log(state); // 例如："550e8400-e29b-41d4-a716-446655440000"
 * ```
 */
export const createState = <T>(data: T): string => {
  // 定期清理过期 state
  clearExpiredStateData()

  const state = crypto.randomUUID() // 使用 crypto.randomUUID() 生成唯一的 state 字符串
  const createdAt = Date.now()
  stateStore.set(state, { data, createdAt })
  console.log(`State created: ${state}`)
  return state
}

/**
 * 获取并校验 state，返回关联的数据
 * 该函数验证提供的 state 是否有效且未过期，如果有效则返回关联的数据
 * 如果 state 无效或已过期，则返回 null
 *
 * @template T 存储的数据类型
 * @param state 从外部获取的 state 字符串
 * @returns 如果 state 有效且未过期，返回存储的数据；否则返回 null
 *
 * @example
 * ```ts
 * import { getStateData } from "@aiho/hono/state";
 *
 * // 获取 state 关联的数据
 * const stateData = getStateData<{ redirectUri: string }>("550e8400-e29b-41d4-a716-446655440000");
 * if (stateData) {
 *   console.log(stateData.redirectUri); // 例如："http://localhost:8000/callback"
 * }
 * ```
 */
export const getStateData = <T>(state: string): T | null => {
  const stateData = stateStore.get(state) as StateData<T> | undefined
  if (!stateData) {
    console.warn(`Invalid or unknown state received: ${state}`)
    return null
  }

  // 检查是否过期
  const now = Date.now()
  if (now - stateData.createdAt > STATE_EXPIRATION_MS) {
    console.warn(`Expired state received: ${state}`)
    stateStore.delete(state) // 过期也删除
    return null
  }

  return stateData.data
}

/**
 * 删除一个已使用的 state
 * 该函数从存储中删除指定的 state 及其关联数据
 * 通常在成功验证 state 后调用，以防止重放攻击
 *
 * @param state 要删除的 state 字符串
 * @returns void
 *
 * @example
 * ```ts
 * import { deleteStateData } from "@aiho/hono/state";
 *
 * // 删除已使用的 state
 * deleteStateData("550e8400-e29b-41d4-a716-446655440000");
 * ```
 */
export const deleteStateData = (state: string): void => {
  if (stateStore.delete(state)) {
    console.log(`State deleted: ${state}`)
  } else {
    console.warn(`Attempted to delete non-existent state: ${state}`)
  }
}
