import { betterAuth } from 'better-auth'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { db } from '../db/index'

export const auth = betterAuth({
  emailAndPassword: { enabled: true, requireEmailVerification: false, autoSignIn: true },
  database: drizzleAdapter(db, { provider: 'pg' }),
  plugins: [tanstackStartCookies()],
})
