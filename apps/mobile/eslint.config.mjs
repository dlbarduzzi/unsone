import { base } from "@unsone/eslint-config/base"
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)
const expoConfig = require("eslint-config-expo/flat")

export default base(
  {
    type: "app",
    // Expo config handles React, React Native, and import rules.
    react: false,
    imports: false,
  },
  ...expoConfig,
  {
    ignores: ["dist/*"],
  },
)
