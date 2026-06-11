import { auth } from '#/lib/auth'
import { redirect } from '@tanstack/react-router'
import { createMiddleware } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'

const getSession = async () => {
  try {
    const headers = getRequestHeaders()
    return await auth.api.getSession({ headers })
  } catch {
    return null
  }
}

export const authFnMiddleware = createMiddleware({ type: 'function' }).server(async ({ next }) => {
  const session = await getSession()
  if (!session) throw redirect({ to: '/sign-in' })
  return next({ context: { session } })
})

export const authReqMiddleware = createMiddleware({ type: 'request' }).server(
  async ({ pathname, next }) => {
    const privateRoutes = ['/files', '/file']
    const publicRoutes = ['/', '/sign-in', '/sign-up']

    const session = await getSession()

    const isPrivateRoute = privateRoutes.some(
      privateRoute => pathname === privateRoute || pathname.startsWith(`${privateRoute}/`),
    )
    const isAuthRoute = publicRoutes.includes(pathname)

    if (!session && isPrivateRoute) throw redirect({ to: '/sign-in' })
    if (session && isAuthRoute) throw redirect({ to: '/files' })

    return next({ context: { session } })
  },
)
