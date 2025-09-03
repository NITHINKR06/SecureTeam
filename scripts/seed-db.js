import mongoose from "mongoose"
import { hashPassword } from "../src/infrastructure/auth/jwt.js"
import { UserModel } from "../src/infrastructure/db/models/User.js"
import { MessageModel } from "../src/infrastructure/db/models/Message.js"
import dotenv from "dotenv"

// Load environment variables
dotenv.config({ path: ".env.local" })

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/secureTeam"

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seed...")
    
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI)
    console.log("✅ Connected to MongoDB")

    // Clear existing data
    await UserModel.deleteMany({})
    await MessageModel.deleteMany({})
    console.log("🗑️ Cleared existing data")

    // Create users
    const hashedPassword = await hashPassword("demo123")
    
    const users = await UserModel.create([
      {
        email: "demo@secureteam.com",
        password: hashedPassword,
        name: "Demo User",
        role: "member",
        isOnline: true,
        avatarUrl: null,
      },
      {
        email: "john@secureteam.com",
        password: hashedPassword,
        name: "John Doe",
        role: "admin",
        isOnline: true,
        avatarUrl: null,
      },
      {
        email: "sarah@secureteam.com",
        password: hashedPassword,
        name: "Sarah Chen",
        role: "member",
        isOnline: true,
        avatarUrl: null,
      },
      {
        email: "mike@secureteam.com",
        password: hashedPassword,
        name: "Mike Wilson",
        role: "member",
        isOnline: false,
        avatarUrl: null,
      },
      {
        email: "emma@secureteam.com",
        password: hashedPassword,
        name: "Emma Davis",
        role: "member",
        isOnline: true,
        avatarUrl: null,
      },
    ])
    
    console.log(`✅ Created ${users.length} users`)

    // Create a default team ID (for demo purposes)
    const teamId = new mongoose.Types.ObjectId()
    
    // Create a default channel ID (for demo purposes)
    const channelId = new mongoose.Types.ObjectId()

    // Create messages
    const messages = await MessageModel.create([
      {
        teamId,
        channelId,
        userId: users[1]._id, // John Doe
        body: "Good morning team! 👋 Hope everyone had a great weekend.",
        reactions: [
          { emoji: "👍", users: [users[0]._id, users[2]._id] },
          { emoji: "😊", users: [users[3]._id] }
        ],
        threadCount: 3,
        lastReplyAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      },
      {
        teamId,
        channelId,
        userId: users[2]._id, // Sarah Chen
        body: "Quick reminder: We have our weekly standup in 15 minutes. Here's the agenda:\n\n1. Sprint progress update\n2. Blockers discussion\n3. Next week's priorities\n4. Q&A\n\nSee you all there! 📋",
        reactions: [
          { emoji: "🔥", users: [users[0]._id, users[1]._id, users[3]._id, users[4]._id] },
          { emoji: "📝", users: [users[1]._id] }
        ],
        threadCount: 5,
        lastReplyAt: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      },
      {
        teamId,
        channelId,
        userId: users[3]._id, // Mike Wilson
        body: "I've fixed the bug in the authentication flow. PR is ready for review: #1234\n\nThe issue was related to token expiration not being handled properly. Added proper error handling and retry logic.",
        reactions: [
          { emoji: "🚀", users: [users[0]._id, users[1]._id, users[2]._id] },
          { emoji: "👏", users: [users[2]._id] },
          { emoji: "💪", users: [users[4]._id] }
        ],
        threadCount: 8,
        lastReplyAt: new Date(),
      },
      {
        teamId,
        channelId,
        userId: users[4]._id, // Emma Davis
        body: "New dashboard designs are ready! 🎨\n\nI've incorporated all the feedback from last week's review. The new version includes:\n• Improved data visualization\n• Better mobile responsiveness\n• Accessibility enhancements\n• Dark mode support\n\nFigma link: [View Designs](https://figma.com/...)",
        reactions: [
          { emoji: "😍", users: [users[0]._id, users[1]._id, users[2]._id, users[3]._id] },
          { emoji: "🎨", users: [users[1]._id, users[2]._id] },
          { emoji: "💯", users: [users[3]._id] }
        ],
        threadCount: 12,
        lastReplyAt: new Date(Date.now() - 60 * 1000), // 1 minute ago
      },
    ])
    
    console.log(`✅ Created ${messages.length} messages`)

    console.log("\n🎉 Database seeded successfully!")
    console.log("\n📝 Test credentials:")
    console.log("   Email: demo@secureteam.com")
    console.log("   Password: demo123")
    
    process.exit(0)
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    process.exit(1)
  }
}

// Run the seed function
seedDatabase()
