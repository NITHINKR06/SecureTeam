import { NextResponse } from "next/server"
import { connectDb } from "@/src/infrastructure/db/mongoose"
import { UserModel } from "@/src/infrastructure/db/models/User"
import { verifyPassword, setAuthCookie } from "@/src/infrastructure/auth/jwt"

export async function POST(req) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    await connectDb()

    // Find user by email
    const user = await UserModel.findOne({ email: email.toLowerCase() })
    
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await verifyPassword(user.password, password)
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Set auth cookie
    await setAuthCookie(user._id.toString())

    // Update last active
    user.lastActiveAt = new Date()
    user.isOnline = true
    await user.save()

    // Return user data
    return NextResponse.json({
      success: true,
      user: user.toPublicProfile()
    })
  } catch (error) {
    console.error("[Login] Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
