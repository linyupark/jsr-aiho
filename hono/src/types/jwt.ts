export type JWTPayload = {
  [key: string]: string | number | boolean | null | undefined | unknown
}

export type Variables = {
  jwtPayload: JWTPayload
}

export type JWTConfig = {
  secret: string
  validityPeriod?: number // 有效期(秒)
}

export interface JWTService {
  sign(payload: JWTPayload): Promise<string>
  verify(token: string): Promise<JWTPayload>
  getValidityPeriod(): number
}
