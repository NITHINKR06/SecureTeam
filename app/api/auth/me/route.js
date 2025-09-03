import { NextResponse } from "next/server"
import { getAuthUser } from "@/src/infrastructure/auth/jwt"

export async function GET() {
  try {
    const user = await getAuthUser()
    
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        role: user.role || "member"
      }
    })
  } catch (error) {
    console.error("[Auth] Error getting current user:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
