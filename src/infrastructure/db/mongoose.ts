import mongoose from "mongoose"

declare global {
  // eslint-disable-next-line no-var
  var _mongooseConn: Promise<typeof mongoose> | undefined
}

const MONGO_URI = process.env.MONGO_URI
if (!MONGO_URI) {
  console.warn("[SecureTeam] Missing MONGO_URI environment variable")
}

export async function connectDb() {
  if (global._mongooseConn) return global._mongooseConn
  global._mongooseConn = mongoose
    .connect(MONGO_URI as string)
    .then((m) => m)
    .catch((err) => {
      console.error("[SecureTeam] MongoDB connection error:", err)
      throw err
    })
  return global._mongooseConn
}
