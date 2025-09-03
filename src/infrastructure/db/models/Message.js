import mongoose from "mongoose"

const MessageSchema = new mongoose.Schema(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    body: {
      type: String,
      required: true,
      maxlength: 8000,
    },
    files: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
    }],
    threadRootId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    reactions: [{
      emoji: String,
      users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }],
    }],
    editedAt: {
      type: Date,
      default: null,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    threadCount: {
      type: Number,
      default: 0,
    },
    lastReplyAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes
MessageSchema.index({ channelId: 1, createdAt: -1 })
MessageSchema.index({ threadRootId: 1 })
MessageSchema.index({ userId: 1 })
MessageSchema.index({ teamId: 1 })

// Virtual for checking if message is edited
MessageSchema.virtual("isEdited").get(function() {
  return this.editedAt !== null
})

// Virtual for checking if message is deleted
MessageSchema.virtual("isDeleted").get(function() {
  return this.deletedAt !== null
})

// Method to add reaction
MessageSchema.methods.addReaction = async function(emoji, userId) {
  const existingReaction = this.reactions.find(r => r.emoji === emoji)
  
  if (existingReaction) {
    if (!existingReaction.users.includes(userId)) {
      existingReaction.users.push(userId)
    }
  } else {
    this.reactions.push({ emoji, users: [userId] })
  }
  
  return this.save()
}

// Method to remove reaction
MessageSchema.methods.removeReaction = async function(emoji, userId) {
  const reaction = this.reactions.find(r => r.emoji === emoji)
  
  if (reaction) {
    reaction.users = reaction.users.filter(u => !u.equals(userId))
    if (reaction.users.length === 0) {
      this.reactions = this.reactions.filter(r => r.emoji !== emoji)
    }
  }
  
  return this.save()
}

export const MessageModel = mongoose.models.Message || mongoose.model("Message", MessageSchema)
