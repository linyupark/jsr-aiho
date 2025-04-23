/**
 * JWT 类型模块，定义了与 JWT 相关的类型和接口。
 * 该模块包含 JWT 负载数据、上下文变量、配置和服务接口的类型定义。
 *
 * @example
 * ```ts
 * import type { JWTPayload, JWTConfig, JWTService } from "@aiho/hono/jwt";
 *
 * // 使用 JWT 负载数据类型
 * const payload: JWTPayload = {
 *   userId: "123",
 *   role: "admin",
 *   exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 // 7 天后过期
 * };
 *
 * // 使用 JWT 配置类型
 * const config: JWTConfig = {
 *   secret: "your-secret-key",
 *   validityPeriod: 60 * 60 * 24 * 7 // 7 天
 * };
 * ```
 *
 * @module
 */

/**
 * JWT 负载数据类型
 */
export type JWTPayload = {
  /** 允许任意键值对 */
  [key: string]: string | number | boolean | null | undefined | unknown
}

/**
 * Hono 上下文变量类型，用于存储 JWT 负载数据
 */
export type Variables = {
  /** JWT 负载数据 */
  jwtPayload: JWTPayload
}

/**
 * JWT 服务配置类型
 */
export type JWTConfig = {
  /** JWT 密钥 */
  secret: string
  /** 令牌有效期(秒)，默认为 7 天 */
  validityPeriod?: number
}

/**
 * JWT 服务接口，定义 JWT 的生成、验证和管理功能
 */
export interface JWTService {
  /**
   * 签发 JWT 令牌
   * @param payload JWT 负载数据
   * @returns 生成的 JWT 令牌
   */
  sign(payload: JWTPayload): Promise<string>

  /**
   * 验证 JWT 令牌
   * @param token JWT 令牌字符串
   * @returns JWT 负载数据
   */
  verify(token: string): Promise<JWTPayload>

  /**
   * 获取令牌的有效期（秒）
   * @returns 有效期秒数
   */
  getValidityPeriod(): number
}
