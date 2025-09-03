import { NextResponse } from "next/server"
import { connectDB } from "@/src/infrastructure/db/mongoose"
import UserModel from "@/src/infrastructure/db/models/User"
import { generateToken } from "@/src/infrastructure/auth/jwt"

export async function POST(req) {
  try {
    const { email, name, googleId, avatar } = await req.json()

    if (!email || !googleId) {
      return NextResponse.json(
        { error: "Email and Google ID are required" },
        { status: 400 }
      )
    }

    await connectDB()

    // Check if user exists
    let user = await UserModel.findOne({ 
      $or: [
        { email },
        { googleId }
      ]
    })

    if (!user) {
      // Create new user from Google account
      user = await UserModel.create({
        email,
        name: name || email.split('@')[0],
        googleId,
        avatarUrl: avatar,
        provider: 'google',
        // Generate a random password for Google users (they won't use it)
        password: Math.random().toString(36).slice(-12),
        status: 'active',
        role: 'member'
      })
    } else {
      // Update existing user with Google info
      user.googleId = googleId
      user.name = name || user.name
      user.avatarUrl = avatar || user.avatarUrl
      user.lastLogin = new Date()
      await user.save()
    }

    // Generate JWT token
    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      name: user.name
    })

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        provider: 'google'
      }
    })

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
  } catch (error) {
    console.error('Google auth sync error:', error)
    
    // Return success even if backend fails (Firebase auth is primary)
    return NextResponse.json({
      success: true,
      message: 'Google auth successful (backend sync skipped)'
    })
  }
}
