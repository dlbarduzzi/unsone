import * as SecureStore from "expo-secure-store"

import { expoClient } from "@better-auth/expo/client"
import { createAuthClient } from "better-auth/react"

import { getBaseUrl } from "./base-url"

export const auth = createAuthClient({
  baseURL: getBaseUrl(),
  plugins: [
    expoClient({
      scheme: "unsone",
      storage: SecureStore,
      storagePrefix: "unsone",
    }),
  ],
})
