/**
 * 通用状态数据接口，允许存储任意类型的数据。
 */
interface StateData<T = unknown> {
  data: T
  createdAt: number
}

// 使用 Map 存储 state，键是 state 字符串，值是包含数据和创建时间戳的对象
const stateStore = new Map<string, StateData>()

// state 有效期（例如：10分钟，以毫秒为单位）
const STATE_EXPIRATION_MS = 10 * 60 * 1000

/**
 * 清理过期的 state
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
 * @param data 要与 state 关联的数据
 * @returns 生成的 state 字符串
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
 * @param state 从外部获取的 state 字符串
 * @returns 如果 state 有效且未过期，返回存储的数据；否则返回 null
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
 * @param state 要删除的 state 字符串
 */
export const deleteStateData = (state: string): void => {
  if (stateStore.delete(state)) {
    console.log(`State deleted: ${state}`)
  } else {
    console.warn(`Attempted to delete non-existent state: ${state}`)
  }
}
