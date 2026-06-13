import z from "zod"
import { createEnv } from "@t3-oss/env-core"

export const env = createEnv({
  clientPrefix: "EXPO_PUBLIC_",
  client: {
    EXPO_PUBLIC_API_URL: z.url(),
  },
  onValidationError: issues => {
    console.error(
      "❌ MOBILE - Missing Environment Variables ❌",
      JSON.stringify(issues, null, 2),
    )
    // eslint-disable-next-line node/no-process-exit
    process.exit(1)
  },
  runtimeEnv: {
    /* eslint-disable node/no-process-env */
    EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
    /* eslint-enable node/no-process-env */
  },
  emptyStringAsUndefined: true,
  /* eslint-disable node/no-process-env */
  skipValidation:
    !!process.env.CI ||
    process.env.SKIP_ENV_VALIDATION === "true" ||
    process.env.npm_lifecycle_event === "lint",
  /* eslint-enable node/no-process-env */
})
