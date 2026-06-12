import "server-only"

import { env } from "./env"
import { initAuth } from "@unsone/auth/core"

const auth = initAuth({
  isDev: env.NODE_ENV === "development",
  baseUrl: env.AUTH_URL,
  secret: env.AUTH_SECRET,
  githubClientId: env.AUTH_GITHUB_ID,
  githubClientSecret: env.AUTH_GITHUB_SECRET,
  googleClientId: env.AUTH_GOOGLE_ID,
  googleClientSecret: env.AUTH_GOOGLE_SECRET,
})

export { auth }
