import Constants from "expo-constants"

export function getBaseUrl(): string {
  return Constants.expoConfig?.extra?.apiUrl ?? ""
}
