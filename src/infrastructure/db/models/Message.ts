import { Schema, model, models } from "mongoose"

const ReactionSchema = new Schema(
  {
    emoji: { type: String, required: true },
    userIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { _id: false },
)

const MessageSchema = new Schema(
  {
    teamId: { type: Schema.Types.ObjectId, ref: "Team", index: true, required: true },
    channelId: { type: Schema.Types.ObjectId, ref: "Channel", index: true, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true, required: true },
    body: { type: String, required: true },
    reactions: [ReactionSchema],
    files: [{ type: Schema.Types.ObjectId, ref: "File" }],
    threadRootId: { type: Schema.Types.ObjectId, ref: "Message" },
  },
  { timestamps: true },
)

export const MessageModel = models.Message || model("Message", MessageSchema)
