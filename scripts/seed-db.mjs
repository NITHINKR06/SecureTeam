import mongoose from "mongoose"
import argon2 from "argon2"
import dotenv from "dotenv"
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env.local') })

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/secureTeam"

// Define schemas directly in the seed script
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  avatarUrl: String,
  role: { type: String, default: "member" },
  isOnline: { type: Boolean, default: false },
  lastActiveAt: { type: Date, default: Date.now },
}, { timestamps: true })

const MessageSchema = new mongoose.Schema({
  teamId: mongoose.Schema.Types.ObjectId,
  channelId: mongoose.Schema.Types.ObjectId,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  body: { type: String, required: true },
  reactions: [{
    emoji: String,
    users: [mongoose.Schema.Types.ObjectId]
  }],
  threadCount: { type: Number, default: 0 },
  lastReplyAt: Date,
}, { timestamps: true })

const User = mongoose.models.User || mongoose.model("User", UserSchema)
const Message = mongoose.models.Message || mongoose.model("Message", MessageSchema)

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seed...")
    console.log("📍 Connecting to:", MONGO_URI)
    
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI)
    console.log("✅ Connected to MongoDB")

    // Clear existing data
    await User.deleteMany({})
    await Message.deleteMany({})
    console.log("🗑️ Cleared existing data")

    // Create users
    const hashedPassword = await argon2.hash("demo123")
    
    const users = await User.create([
      {
        email: "demo@secureteam.com",
        password: hashedPassword,
        name: "Demo User",
        role: "member",
        isOnline: true,
      },
      {
        email: "john@secureteam.com",
        password: hashedPassword,
        name: "John Doe",
        role: "admin",
        isOnline: true,
      },
      {
        email: "sarah@secureteam.com",
        password: hashedPassword,
        name: "Sarah Chen",
        role: "member",
        isOnline: true,
      },
      {
        email: "mike@secureteam.com",
        password: hashedPassword,
        name: "Mike Wilson",
        role: "member",
        isOnline: false,
      },
      {
        email: "emma@secureteam.com",
        password: hashedPassword,
        name: "Emma Davis",
        role: "member",
        isOnline: true,
      },
    ])
    
    console.log(`✅ Created ${users.length} users`)

    // Create a default team ID and channel ID
    const teamId = new mongoose.Types.ObjectId()
    const channelId = new mongoose.Types.ObjectId()

    // Create messages
    const messages = await Message.create([
      {
        teamId,
        channelId,
        userId: users[1]._id,
        body: "Good morning team! 👋 Hope everyone had a great weekend.",
        reactions: [
          { emoji: "👍", users: [users[0]._id, users[2]._id] },
          { emoji: "😊", users: [users[3]._id] }
        ],
        threadCount: 3,
        lastReplyAt: new Date(Date.now() - 5 * 60 * 1000),
      },
      {
        teamId,
        channelId,
        userId: users[2]._id,
        body: "Quick reminder: We have our weekly standup in 15 minutes. Here's the agenda:\n\n1. Sprint progress update\n2. Blockers discussion\n3. Next week's priorities",
        reactions: [
          { emoji: "🔥", users: [users[0]._id, users[1]._id] },
        ],
        threadCount: 5,
        lastReplyAt: new Date(Date.now() - 2 * 60 * 1000),
      },
      {
        teamId,
        channelId,
        userId: users[3]._id,
        body: "I've fixed the bug in the authentication flow. PR is ready for review: #1234",
        reactions: [
          { emoji: "🚀", users: [users[0]._id, users[1]._id, users[2]._id] },
        ],
        threadCount: 8,
        lastReplyAt: new Date(),
      },
      {
        teamId,
        channelId,
        userId: users[4]._id,
        body: "New dashboard designs are ready! 🎨 Check them out in Figma.",
        reactions: [
          { emoji: "😍", users: [users[0]._id, users[1]._id, users[2]._id, users[3]._id] },
        ],
        threadCount: 12,
        lastReplyAt: new Date(Date.now() - 60 * 1000),
      },
    ])
    
    console.log(`✅ Created ${messages.length} messages`)

    console.log("\n🎉 Database seeded successfully!")
    console.log("\n📝 Test credentials:")
    console.log("   Email: demo@secureteam.com")
    console.log("   Password: demo123")
    console.log("\n   Also available:")
    console.log("   - john@secureteam.com / demo123")
    console.log("   - sarah@secureteam.com / demo123")
    console.log("   - mike@secureteam.com / demo123")
    console.log("   - emma@secureteam.com / demo123")
    
    await mongoose.disconnect()
    console.log("\n✅ Disconnected from MongoDB")
    process.exit(0)
  } catch (error) {
    console.error("\n❌ Error seeding database:", error.message)
    if (error.message.includes("ECONNREFUSED")) {
      console.error("\n⚠️  MongoDB is not running!")
      console.error("   Please start MongoDB first:")
      console.error("   - If using MongoDB locally, make sure it's running")
      console.error("   - Check that MongoDB is accessible at:", MONGO_URI)
    }
    process.exit(1)
  }
}

// Run the seed function
seedDatabase()
