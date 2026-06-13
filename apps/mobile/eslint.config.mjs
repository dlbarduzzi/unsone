import { config } from "@unsone/eslint-config/config"
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)
const expoConfig = require("eslint-config-expo/flat")

export default config(
  {
    type: "app",
    // Expo config handles React, React Native, and import rules.
    react: false,
    imports: false,
  },
  ...expoConfig,
  {
    ignores: ["dist/*", ".expo"],
    rules: {
      "import/no-named-as-default": "off",
    },
  },
)
