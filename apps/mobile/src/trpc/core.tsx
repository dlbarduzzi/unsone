import type { ReactNode } from "react"
import type { AppRouter } from "@unsone/trpc/types"

import superjson from "superjson"

import { useState } from "react"
import { createTRPCContext } from "@trpc/tanstack-react-query"
import { QueryClientProvider } from "@tanstack/react-query"
import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client"

import { auth } from "@/lib/auth"
import { getBaseUrl } from "@/lib/base-url"

import { newQueryClient } from "./query"

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>()

function getUrl() {
  const base = getBaseUrl()
  return `${base}/api/trpc`
}

export function TRPCReactProvider(props: Readonly<{ children: ReactNode }>) {
  const [queryClient] = useState(() => newQueryClient())
  const [trpcClient] = useState(() => {
    return createTRPCClient<AppRouter>({
      links: [
        loggerLink({
          enabled: (opts) =>
            // eslint-disable-next-line node/no-process-env
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
          colorMode: "ansi",
        }),
        httpBatchLink({
          url: getUrl(),
          transformer: superjson,
          headers() {
            const headers = new Map<string, string>()
            const cookies = auth.getCookie()
            if (cookies) {
              headers.set("Cookie", cookies)
            }
            return Object.fromEntries(headers)
          },
        }),
      ],
    })
  })
  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProvider>
    </QueryClientProvider>
  )
}
