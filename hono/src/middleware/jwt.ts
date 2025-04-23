import type { Context, Next } from 'hono'
import type { JWTPayload, Variables } from '../types/jwt.ts'

/**
 * 创建 JWT 验证中间件
 * @param verifyFn JWT 验证函数，用于验证令牌并返回负载数据
 * @returns Hono 中间件函数，用于验证请求中的 JWT 令牌
 */
export const createJWTMiddleware = (
  verifyFn: (token: string) => Promise<JWTPayload>
): ((
  c: Context<{ Variables: Variables }>,
  next: Next
) => Promise<Response | void>) => {
  return async (c: Context<{ Variables: Variables }>, next: Next) => {
    const token = c.req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return c.json({ error: '未提供认证令牌' }, 401)
    }

    try {
      const payload = await verifyFn(token)
      c.set('jwtPayload', payload)
      await next()
    } catch (_) {
      return c.json({ error: '无效的认证令牌' }, 401)
    }
  }
}
