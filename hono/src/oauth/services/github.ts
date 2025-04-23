/**
 * GitHub OAuth 模块，提供了与 GitHub OAuth 认证集成的功能。
 * 该模块包含生成 GitHub 认证重定向 URL 和处理回调的功能。
 *
 * @example
 * ```ts
 * import { Hono } from "hono";
 * import { getGithubRedirectUrl, handleGithubCallback } from "@aiho/hono/oauth/services/github";
 *
 * // 设置环境变量
 * // GITHUB_CLIENT_ID=your-client-id
 * // GITHUB_CLIENT_SECRET=your-client-secret
 * // GITHUB_REDIRECT_URI=http://localhost:8000/auth/github/callback
 *
 * const app = new Hono();
 *
 * // GitHub OAuth 路由
 * app.get("/auth/github", (c) => getGithubRedirectUrl(c));
 * app.get("/auth/github/callback", async (c) => {
 *   const userInfo = await handleGithubCallback(c);
 *   // 处理用户信息，例如创建会话或设置 cookie
 *   return c.json(userInfo);
 * });
 * ```
 *
 * @module
 */

import type { Context } from 'hono'
import type { GitHubEmail } from '../../oauth/types.ts'
import {
  createState,
  getStateData,
  deleteStateData
} from '../../state/services.ts' // 导入 state 管理函数

/** GitHub OAuth 授权 URL */
const GITHUB_AUTH_URL: string = 'https://github.com/login/oauth/authorize'
/** GitHub OAuth 令牌 URL */
const GITHUB_TOKEN_URL: string = 'https://github.com/login/oauth/access_token'
/** GitHub 用户信息 API URL */
const GITHUB_USER_URL: string = 'https://api.github.com/user'

/**
 * 获取 GitHub OAuth 重定向 URL
 * 该函数生成一个重定向到 GitHub OAuth 授权页面的 URL，并将用户重定向到该页面
 *
 * @param c Hono 上下文
 * @returns 重定向响应，将用户导向 GitHub 授权页面
 * @throws 如果环境变量未配置，将返回 500 错误
 *
 * @requires GITHUB_CLIENT_ID - 环境变量，GitHub OAuth 客户端 ID
 * @requires GITHUB_REDIRECT_URI - 环境变量，GitHub OAuth 回调 URL
 */
export const getGithubRedirectUrl = (c: Context): Response => {
  const clientId = Deno.env.get('GITHUB_CLIENT_ID')
  const redirectUri = Deno.env.get('GITHUB_REDIRECT_URI') // e.g., http://localhost:8000/auth/github/callback

  if (!clientId || !redirectUri) {
    console.error(
      'GitHub Client ID or Redirect URI not configured in environment variables.'
    )
    return c.json({ error: 'Server configuration error' }, 500)
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'read:user user:email', // 请求用户基本信息和邮箱
    state: createState({ redirectUri }) // 使用通用状态管理器创建 state，存储 redirectUri
  })

  const url = `${GITHUB_AUTH_URL}?${params.toString()}`
  console.log(`Redirecting to GitHub Auth URL: ${url}`)
  return c.redirect(url)
}

/**
 * 处理 GitHub OAuth 回调
 * 该函数处理来自 GitHub OAuth 服务的回调请求，验证授权码和状态，
 * 获取访问令牌，然后获取用户信息和邮箱
 *
 * @param c Hono 上下文
 * @returns 包含用户信息的响应或错误响应
 * @throws 如果授权码缺失、状态无效或环境变量未配置，将返回相应的错误响应
 *
 * @requires GITHUB_CLIENT_ID - 环境变量，GitHub OAuth 客户端 ID
 * @requires GITHUB_CLIENT_SECRET - 环境变量，GitHub OAuth 客户端密钥
 * @requires GITHUB_REDIRECT_URI - 环境变量，GitHub OAuth 回调 URL
 */
export const handleGithubCallback = async (c: Context): Promise<Response> => {
  const code = c.req.query('code')
  const state = c.req.query('state') // 获取回调中的 state
  const clientId = Deno.env.get('GITHUB_CLIENT_ID')
  const clientSecret = Deno.env.get('GITHUB_CLIENT_SECRET')
  const redirectUri = Deno.env.get('GITHUB_REDIRECT_URI')

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

  // 确保回调的 redirectUri 与 state 中存储的一致 (虽然 GitHub 通常在服务器端校验)
  // if (storedStateData.callbackUrl !== redirectUri) {
  //   console.error('Callback URL mismatch detected.');
  //   return c.json({ error: 'Callback URL mismatch' }, 400);
  // }

  if (!clientId || !clientSecret || !redirectUri) {
    console.error('GitHub OAuth environment variables not fully configured.')
    return c.json({ error: 'Server configuration error' }, 500)
  }

  try {
    // 1. 使用授权码换取 Token
    const tokenResponse = await fetch(GITHUB_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json' // 要求 GitHub 返回 JSON 格式
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri
      })
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error(
        `Failed to exchange code for token: ${tokenResponse.status} ${errorText}`
      )
      return c.json({ error: 'Failed to obtain access token from GitHub' }, 500)
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    if (!accessToken) {
      console.error('Access token not found in GitHub response:', tokenData)
      return c.json({ error: 'Failed to obtain access token from GitHub' }, 500)
    }

    // 2. 使用 Access Token 获取用户信息
    const userInfoResponse = await fetch(GITHUB_USER_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json' // 使用 GitHub API v3
      }
    })

    if (!userInfoResponse.ok) {
      const errorText = await userInfoResponse.text()
      console.error(
        `Failed to fetch user info: ${userInfoResponse.status} ${errorText}`
      )
      return c.json({ error: 'Failed to fetch user info from GitHub' }, 500)
    }

    const githubUser = await userInfoResponse.json()

    // 尝试获取用户主邮箱 (可能需要额外请求 /user/emails)
    let email = githubUser.email
    if (!email) {
      try {
        const emailsResponse = await fetch(`${GITHUB_USER_URL}/emails`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/vnd.github.v3+json'
          }
        })
        if (emailsResponse.ok) {
          const emails = await emailsResponse.json()
          const primaryEmail = emails.find((e: GitHubEmail) => e.primary)
          if (primaryEmail) {
            email = primaryEmail.email
          }
        }
      } catch (emailError) {
        console.warn('Could not fetch user emails:', emailError)
      }
    }

    // 3. 返回标准化用户信息
    const userInfo = {
      provider: 'github',
      id: githubUser.id.toString(), // GitHub ID 是数字，转为字符串
      name: githubUser.name || githubUser.login, // 可能没有设置 name，使用 login 作为备选
      email: email, // 可能为 null
      picture: githubUser.avatar_url
      // 可以添加 login, bio 等其他字段
    }

    console.log('Successfully fetched GitHub user info:', userInfo)
    // TODO: 在这里处理用户信息，例如查找或创建用户，设置 session/cookie 等

    return c.json(userInfo)
  } catch (error) {
    console.error('Error during GitHub OAuth callback:', error)
    return c.json({ error: 'Internal server error during OAuth callback' }, 500)
  }
}
