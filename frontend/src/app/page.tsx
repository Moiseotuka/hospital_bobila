import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function Home() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")

  if (token?.value && token.value !== "undefined" && token.value !== "null") {
    redirect("/dashboard")
  }

  redirect("/login")
}
