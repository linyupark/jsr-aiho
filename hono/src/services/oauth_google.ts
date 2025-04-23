import type { Context } from 'hono'
import { createState, deleteStateData, getStateData } from './state_manager.ts' // 导入 state 管理函数

/** Google OAuth 授权 URL */
const GOOGLE_AUTH_URL: string = 'https://accounts.google.com/o/oauth2/v2/auth'
/** Google OAuth 令牌 URL */
const GOOGLE_TOKEN_URL: string = 'https://oauth2.googleapis.com/token'
/** Google 用户信息 API URL */
const GOOGLE_USERINFO_URL: string =
  'https://www.googleapis.com/oauth2/v2/userinfo'

/**
 * 获取 Google OAuth 重定向 URL
 * @param c Hono 上下文
 * @returns 重定向响应
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
 * @param c Hono 上下文
 * @returns 包含用户信息的响应或错误响应
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
