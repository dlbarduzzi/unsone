const path = require("node:path")

const { FileStore } = require("metro-cache")
const { withNativewind } = require("nativewind/metro")
const { getDefaultConfig } = require("expo/metro-config")

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname)

config.cacheStores = [
  new FileStore({
    root: path.join(__dirname, "node_modules", ".cache", "metro"),
  }),
]

module.exports = withNativewind(config)
