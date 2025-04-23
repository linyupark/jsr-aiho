import { sign, verify } from 'hono/jwt'
import type { JWTConfig, JWTPayload, JWTService } from '../types/jwt.ts'

export class DefaultJWTService implements JWTService {
  private secret: string
  private validityPeriod: number

  constructor(config: JWTConfig) {
    this.secret = config.secret
    // 默认7天
    this.validityPeriod = config.validityPeriod || 7 * 24 * 60 * 60
  }

  private getExpirationTime(): number {
    return Math.floor(Date.now() / 1000) + this.validityPeriod
  }

  async sign(payload: JWTPayload): Promise<string> {
    return await sign(
      { ...payload, exp: this.getExpirationTime() },
      this.secret
    )
  }

  async verify(token: string): Promise<JWTPayload> {
    return await verify(token, this.secret)
  }

  getValidityPeriod(): number {
    return this.validityPeriod
  }
}
