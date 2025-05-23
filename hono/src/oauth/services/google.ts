/**
 * Google OAuth 模块，提供了与 Google OAuth 认证集成的功能。
 * 该模块包含生成 Google 认证重定向 URL 和处理回调的功能。
 *
 * @example
 * ```ts
 * import { Hono } from "hono";
 * import { getGoogleRedirectUrl, handleGoogleCallback } from "@aiho/hono/oauth/services/google";
 *
 * // 设置环境变量
 * // GOOGLE_CLIENT_ID=your-client-id
 * // GOOGLE_CLIENT_SECRET=your-client-secret
 * // GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
 *
 * const app = new Hono();
 *
 * // Google OAuth 路由
 * app.get("/auth/google", (c) => getGoogleRedirectUrl(c));
 * app.get("/auth/google/callback", async (c) => {
 *   const userInfo = await handleGoogleCallback(c);
 *   // 处理用户信息，例如创建会话或设置 cookie
 *   return c.json(userInfo);
 * });
 * ```
 *
 * @module
 */

import type { Context } from 'hono'
import {
  createState,
  deleteStateData,
  getStateData
} from '../../state/services.ts' // 导入 state 管理函数

/** Google OAuth 授权 URL */
const GOOGLE_AUTH_URL: string = 'https://accounts.google.com/o/oauth2/v2/auth'
/** Google OAuth 令牌 URL */
const GOOGLE_TOKEN_URL: string = 'https://oauth2.googleapis.com/token'
/** Google 用户信息 API URL */
const GOOGLE_USERINFO_URL: string =
  'https://www.googleapis.com/oauth2/v2/userinfo'

/**
 * 获取 Google OAuth 重定向 URL
 * 该函数生成一个重定向到 Google OAuth 授权页面的 URL，并将用户重定向到该页面
 *
 * @param c Hono 上下文
 * @returns 重定向响应，将用户导向 Google 授权页面
 * @throws 如果环境变量未配置，将返回 500 错误
 *
 * @requires GOOGLE_CLIENT_ID - 环境变量，Google OAuth 客户端 ID
 * @requires GOOGLE_REDIRECT_URI - 环境变量，Google OAuth 回调 URL
 */
export const getGoogleRedirectUrl = (c: Context): Response => {
  const clientId = Deno.env.get('GOOGLE_CLIENT_ID')
  const redirectUri = Deno.env.get('GOOGLE_REDIRECT_URI') // e.g., http://localhost:8000/auth/google/callback

  if (!clientId || !redirectUri) {
    console.error(
      'Google Client ID or Redirect URI not configured in environment variables.'
    )
    return c.json({ error: 'Server configuration error' }, 500)
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline', // 可选，如果需要 refresh_token
    prompt: 'consent', // 可选，强制用户同意
    state: createState({ redirectUri }) // 使用通用状态管理器创建 state，存储 redirectUri
  })

  const url = `${GOOGLE_AUTH_URL}?${params.toString()}`
  console.log(`Redirecting to Google Auth URL: ${url}`)
  return c.redirect(url)
}

/**
 * 处理 Google OAuth 回调
 * 该函数处理来自 Google OAuth 服务的回调请求，验证授权码和状态，
 * 获取访问令牌，然后获取用户信息
 *
 * @param c Hono 上下文
 * @returns 包含用户信息的响应或错误响应
 * @throws 如果授权码缺失、状态无效或环境变量未配置，将返回相应的错误响应
 *
 * @requires GOOGLE_CLIENT_ID - 环境变量，Google OAuth 客户端 ID
 * @requires GOOGLE_CLIENT_SECRET - 环境变量，Google OAuth 客户端密钥
 * @requires GOOGLE_REDIRECT_URI - 环境变量，Google OAuth 回调 URL
 */
export const handleGoogleCallback = async (c: Context): Promise<Response> => {
  const code = c.req.query('code')
  const state = c.req.query('state') // 获取回调中的 state
  const clientId = Deno.env.get('GOOGLE_CLIENT_ID')
  const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET')
  const redirectUri = Deno.env.get('GOOGLE_REDIRECT_URI')

  if (!code) {
    console.error('Authorization code missing in callback.')
    return c.json({ error: 'Authorization code missing' }, 400)
  }

  // 校验 state
  if (!state) {
    console.error('State parameter missing in callback.')
    return c.json({ error: 'State parameter missing' }, 400)
  }
  const storedStateData = getStateData<{ redirectUri: string }>(state)
  if (!storedStateData) {
    console.error('Invalid or expired OAuth state.')
    return c.json({ error: 'Invalid or expired state' }, 401)
  }
  deleteStateData(state) // 校验成功后立即删除 state

  // 确保回调的 redirectUri 与 state 中存储的一致
  // if (storedStateData.callbackUrl !== redirectUri) {
  //   console.error('Callback URL mismatch detected.');
  //   return c.json({ error: 'Callback URL mismatch' }, 400);
  // }

  if (!clientId || !clientSecret || !redirectUri) {
    console.error('Google OAuth environment variables not fully configured.')
    return c.json({ error: 'Server configuration error' }, 500)
  }

  try {
    // 1. 使用授权码换取 Token
    const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error(
        `Failed to exchange code for token: ${tokenResponse.status} ${errorText}`
      )
      return c.json({ error: 'Failed to obtain access token from Google' }, 500)
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token
    // const idToken = tokenData.id_token; // id_token 包含用户信息，但通常也用 access token 去获取最新信息

    if (!accessToken) {
      console.error('Access token not found in Google response:', tokenData)
      return c.json({ error: 'Failed to obtain access token from Google' }, 500)
    }

    // 2. 使用 Access Token 获取用户信息
    const userInfoResponse = await fetch(GOOGLE_USERINFO_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    if (!userInfoResponse.ok) {
      const errorText = await userInfoResponse.text()
      console.error(
        `Failed to fetch user info: ${userInfoResponse.status} ${errorText}`
      )
      return c.json({ error: 'Failed to fetch user info from Google' }, 500)
    }

    const googleUser = await userInfoResponse.json()

    // 3. 返回标准化用户信息 (可以根据需要调整结构)
    const userInfo = {
      provider: 'google',
      id: googleUser.id,
      name: googleUser.name,
      email: googleUser.email,
      picture: googleUser.picture
      // 可以添加 email_verified, locale 等其他字段
    }

    console.log('Successfully fetched Google user info:', userInfo)
    // TODO: 在这里处理用户信息，例如查找或创建用户，设置 session/cookie 等

    return c.json(userInfo)
  } catch (error) {
    console.error('Error during Google OAuth callback:', error)
    return c.json({ error: 'Internal server error during OAuth callback' }, 500)
  }
}
