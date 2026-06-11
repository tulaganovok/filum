import { createStart } from '@tanstack/react-start'
import { authReqMiddleware } from './middleware/auth'

export const startInstance = createStart(() => ({
  requestMiddleware: [authReqMiddleware],
}))
