import { db } from "@unsone/db/core"
import { expo } from "@better-auth/expo"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"

type AuthOptions = {
  isDev: boolean
  baseUrl: string
  secret: string
  githubClientId: string
  githubClientSecret: string
  googleClientId: string
  googleClientSecret: string
}

export function initAuth(opts: AuthOptions) {
  return betterAuth({
    appName: "Unsone",
    basePath: "/api/auth",
    baseURL: opts.baseUrl,
    database: drizzleAdapter(db, {
      provider: "pg",
    }),
    secret: opts.secret,
    plugins: [expo()],
    trustedOrigins: [
      "unsone://",
      ...(opts.isDev ? [
        "exp://",
        "exp://**",
        "exp://192.168.*.*:*/**",
      ] : []),
    ],
    advanced: {
      cookiePrefix: "unsone",
    },
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 60 * 5, // 5 minutes
        version: "1",
      },
    },
    socialProviders: {
      github: {
        enabled: true,
        clientId: opts.githubClientId,
        clientSecret: opts.githubClientSecret,
        redirectURI: `${opts.baseUrl}/api/auth/callback/github`,
      },
      google: {
        enabled: true,
        clientId: opts.googleClientId,
        clientSecret: opts.googleClientSecret,
        redirectURI: `${opts.baseUrl}/api/auth/callback/google`,
      },
    },
  })
}

export type Auth = ReturnType<typeof initAuth>
export type Session = Auth["$Infer"]["Session"]
