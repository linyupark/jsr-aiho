import type { Context } from 'hono'

export const helloWorld = (c: Context): Response => {
  return c.json({
    message: 'Hello World!'
  })
}
