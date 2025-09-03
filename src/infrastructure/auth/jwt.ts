import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import argon2 from "argon2"
import { connectDb } from "../db/mongoose"
import { UserModel } from "../db/models/User"

const JWT_SECRET = process.env.JWT_SECRET || "insecure-dev-secret"

export async function hashPassword(password: string) {
  return argon2.hash(password)
}

export async function verifyPassword(hash: string, password: string) {
  return argon2.verify(hash, password)
}

export function signJwt(payload: object, expiresIn = "7d") {
  return jwt.sign(payload, JWT_SECRET, { expiresIn })
}

export function verifyJwt<T = any>(token: string): T | null {
  try {
    return jwt.verify(token, JWT_SECRET) as T
  } catch {
    return null
  }
}

export async function getAuthUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get("secureteam_token")?.value
  if (!token) return null
  const decoded = verifyJwt<{ userId: string }>(token)
  if (!decoded?.userId) return null
  await connectDb()
  const user = await UserModel.findById(decoded.userId).lean()
  if (!user) return null
  return { id: String(user._id), email: user.email, name: user.name, avatarUrl: user.avatarUrl }
}
