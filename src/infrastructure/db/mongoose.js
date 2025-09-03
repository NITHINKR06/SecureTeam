import mongoose from "mongoose"

const MONGO_URI = process.env.MONGO_URI
if (!MONGO_URI) {
  console.warn("[SecureTeam] Missing MONGO_URI environment variable")
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

export async function connectDb() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
      console.log("[SecureTeam] MongoDB connected successfully")
      return mongoose
    }).catch((err) => {
      console.error("[SecureTeam] MongoDB connection error:", err)
      throw err
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}
