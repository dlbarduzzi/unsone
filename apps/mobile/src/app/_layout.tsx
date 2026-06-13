import { Stack } from "expo-router"
import { TRPCReactProvider } from "@/trpc/core"

import "@/styles/global.css"

export default function RootLayout() {
  return (
    <TRPCReactProvider>
      <Stack />
    </TRPCReactProvider>
  )
}
