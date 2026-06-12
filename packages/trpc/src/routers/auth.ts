import { createRouter, protectedProcedure, publicProcedure } from "../trpc"

export const authRouter = createRouter({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session
  }),
  getUserInfo: protectedProcedure.query(({ ctx }) => {
    return ctx.session.user
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "You can see this secret message!"
  }),
})
