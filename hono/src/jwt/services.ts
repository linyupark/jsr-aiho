/**
 * JWT 服务模块，提供 JWT 令牌的生成、验证和管理功能。
 * 该模块实现了 JWTService 接口，提供了一个默认的 JWT 服务实现。
 *
 * @example
 * ```ts
 * import { DefaultJWTService } from "@aiho/hono/jwt";
 *
 * // 创建 JWT 服务实例
 * const jwtService = new DefaultJWTService({
 *   secret: "your-secret-key",
 *   validityPeriod: 60 * 60 * 24 * 7, // 7 天
 * });
 *
 * // 生成 JWT 令牌
 * const token = await jwtService.sign({ userId: "123", role: "admin" });
 *
 * // 验证 JWT 令牌
 * try {
 *   const payload = await jwtService.verify(token);
 *   console.log(payload); // { userId: "123", role: "admin", exp: 1650000000 }
 * } catch (error) {
 *   console.error("Invalid token");
 * }
 * ```
 *
 * @module
 */

import { sign, verify } from 'hono/jwt'
import type { JWTConfig, JWTPayload, JWTService } from './types.ts'

/**
 * JWT 服务的默认实现，提供 JWT 的生成、验证和管理功能
 * 该类实现了 JWTService 接口，提供了签发和验证 JWT 令牌的方法
 *
 * @implements {JWTService}
 *
 * @example
 * ```ts
 * import { DefaultJWTService } from "@aiho/hono/jwt";
 *
 * // 创建 JWT 服务实例
 * const jwtService = new DefaultJWTService({
 *   secret: "your-secret-key",
 *   validityPeriod: 60 * 60 * 24 * 7 // 7 天
 * });
 *
 * // 签发令牌
 * const token = await jwtService.sign({ userId: "123", role: "admin" });
 *
 * // 验证令牌
 * try {
 *   const payload = await jwtService.verify(token);
 *   console.log(payload); // { userId: "123", role: "admin", exp: 1650000000 }
 * } catch (error) {
 *   console.error("Invalid token");
 * }
 * ```
 */
export class DefaultJWTService implements JWTService {
  private secret: string
  private validityPeriod: number

  constructor(config: JWTConfig) {
    this.secret = config.secret
    // 默认7天
    this.validityPeriod = config.validityPeriod || 7 * 24 * 60 * 60
  }

  /**
   * 获取过期时间戳
   * @returns 过期时间戳（秒）
   * @private
   */
  private getExpirationTime(): number {
    return Math.floor(Date.now() / 1000) + this.validityPeriod
  }

  /**
   * 签发 JWT 令牌
   * @param payload JWT 负载数据
   * @returns 生成的 JWT 令牌
   */
  async sign(payload: JWTPayload): Promise<string> {
    return await sign(
      { ...payload, exp: this.getExpirationTime() },
      this.secret
    )
  }

  /**
   * 验证 JWT 令牌
   * @param token JWT 令牌字符串
   * @returns JWT 负载数据
   * @throws 如果令牌无效或已过期
   */
  async verify(token: string): Promise<JWTPayload> {
    return await verify(token, this.secret)
  }

  /**
   * 获取令牌的有效期（秒）
   * @returns 有效期秒数
   */
  getValidityPeriod(): number {
    return this.validityPeriod
  }
}
