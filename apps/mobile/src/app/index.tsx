import { auth } from "@/lib/auth"
import { useTRPC } from "@/trpc/core"
import { useQuery } from "@tanstack/react-query"
import { Pressable, Text, View } from "react-native"

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-sky-200">
      <Text className="text-xl font-bold text-sky-600">
        Welcome to Unsone!
      </Text>
      <GetSession />
      <SignIn />
    </View>
  )
}

function GetSession() {
  const trpc = useTRPC()
  const resp = useQuery(trpc.auth.getSession.queryOptions())

  if (resp.isLoading) {
    return (
      <View className="mt-3">
        <Text>
          Session: Loading...
        </Text>
      </View>
    )
  }

  if (resp.isError) {
    console.error(resp.error)
    return (
      <View className="mt-3">
        <Text>
          Session: An error occurred!
        </Text>
      </View>
    )
  }

  if (!resp.data) {
    return (
      <View className="mt-3">
        <Text>
          Session: No session!
        </Text>
      </View>
    )
  }

  return (
    <View className="mt-3">
      <Text>
        Session:
        {" "}
        {resp.data.user.email}
      </Text>
    </View>
  )
}

function SignIn() {
  const session = auth.useSession()
  console.warn(session)

  // const isAuthenticated = !!(session.data && session.data.user)
  const isAuthenticated = false

  async function signOut() {
    const resp = await auth.signOut()
    if (resp.error) {
      console.error("sign out failed")
      console.error(resp.error)
    }
  }

  async function socialSignIn(provider: "github") {
    try {
      const resp = await auth.signIn.social({
        provider,
        callbackURL: "/",
      })
      if (resp.error) {
        console.error(`failed to sign in with ${provider}`)
        console.error(resp.error)
      }
    }
    catch (error) {
      console.error(`an error occurred while signing in with ${provider}`)
      console.error(error)
    }
  }
  return (
    <View className="mt-3">
      {isAuthenticated ? (
        <Pressable
          onPress={signOut}
          className="bg-neutral-900 px-3 py-2 rounded-lg"
        >
          <Text className="text-white font-medium">
            Sign out
          </Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={() => socialSignIn("github")}
          className="bg-neutral-900 px-3 py-2 rounded-lg"
        >
          <Text className="text-white font-medium">
            Sign in
          </Text>
        </Pressable>
      )}
    </View>
  )
}
