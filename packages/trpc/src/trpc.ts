import type { Auth } from "@unsone/auth/core"

import z from "zod"
import superjson from "superjson"

import { initTRPC, TRPCError } from "@trpc/server"

import { db } from "@unsone/db/core"

async function createContext(auth: Auth, headers: Headers) {
  const session = await auth.api.getSession({ headers })
  return { db, session }
}

type Context = Awaited<ReturnType<typeof createContext>>

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter: ({ shape, error }) => ({
    ...shape,
    data: {
      ...shape.data,
      zodError:
        error.cause instanceof z.ZodError
          ? z.flattenError(error.cause as z.ZodError<Record<string, unknown>>)
          : null,
    },
  }),
})

const createRouter = t.router

const durationMiddleware = t.middleware(async ({ path, next }) => {
  const start = Date.now()

  if (t._config.isDev) {
    // artificial delay in dev 100-500ms
    const delay = Math.floor(Math.random() * 400) + 100
    await new Promise((resolve) => setTimeout(resolve, delay))
  }

  const res = await next()
  const end = Date.now()

  const date = new Date().toISOString()

  // eslint-disable-next-line no-console
  console.log(`${date} [INFO] TRPC ${path} took ${end - start}ms to execute`)

  return res
})

const publicProcedure = t.procedure.use(durationMiddleware)

const protectedProcedure = t.procedure
  .use(durationMiddleware)
  .use(({ ctx, next }) => {
    if (!ctx.session) {
      throw new TRPCError({ code: "UNAUTHORIZED" })
    }
    if (!ctx.session.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" })
    }
    return next({
      ctx: {
        // Infers the `session` as non-nullable.
        session: { ...ctx.session, user: ctx.session.user },
      },
    })
  })

export {
  type Context,
  createContext,
  createRouter,
  protectedProcedure,
  publicProcedure,
}
