import { sign, verify } from 'hono/jwt'
import type { JWTConfig, JWTPayload, JWTService } from '../types/jwt.ts'

/**
 * JWT 服务的默认实现，提供 JWT 的生成、验证和管理功能
 * @implements {JWTService}
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
