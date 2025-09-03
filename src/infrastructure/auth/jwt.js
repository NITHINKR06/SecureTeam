import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import argon2 from "argon2"
import { connectDb } from "../db/mongoose.js"
import { UserModel } from "../db/models/User.js"

const JWT_SECRET = process.env.JWT_SECRET || "insecure-dev-secret"

export async function hashPassword(password) {
  return argon2.hash(password)
}

export async function verifyPassword(hash, password) {
  return argon2.verify(hash, password)
}

export function signJwt(payload, expiresIn = "7d") {
  return jwt.sign(payload, JWT_SECRET, { expiresIn })
}

export function verifyJwt(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

export async function getAuthUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("secureteam_token")?.value
    if (!token) return null
    
    const decoded = verifyJwt(token)
    if (!decoded?.userId) return null
    
    await connectDb()
    const user = await UserModel.findById(decoded.userId).lean()
    if (!user) return null
    
    return { 
      id: String(user._id), 
      email: user.email, 
      name: user.name, 
      avatarUrl: user.avatarUrl 
    }
  } catch (error) {
    console.error("[Auth] Error getting auth user:", error)
    return null
  }
}

export async function setAuthCookie(userId) {
  const token = signJwt({ userId })
  const cookieStore = await cookies()
  
  cookieStore.set("secureteam_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/"
  })
  
  return token
}

export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete("secureteam_token")
}
