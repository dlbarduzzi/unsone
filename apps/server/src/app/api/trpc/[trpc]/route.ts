import { fetchRequestHandler } from "@trpc/server/adapters/fetch"

import { auth } from "@/lib/auth"
import { appRouter } from "@unsone/trpc/root"
import { createContext } from "@unsone/trpc/core"

function handler(req: Request) {
  return fetchRequestHandler({
    req,
    router: appRouter,
    endpoint: "/api/trpc",
    createContext: () => createContext(auth, req.headers),
    onError({ path, error }) {
      const date = new Date().toISOString()
      console.error(`${date} [ERROR] TRPC ${path} -`, error)
    },
  })
}

export { handler as GET, handler as POST }
