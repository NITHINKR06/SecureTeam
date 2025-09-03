import { Schema, model, models } from "mongoose"

const ChannelSchema = new Schema(
  {
    teamId: { type: Schema.Types.ObjectId, ref: "Team", index: true, required: true },
    name: { type: String, required: true },
    topic: String,
    isPrivate: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export const ChannelModel = models.Channel || model("Channel", ChannelSchema)
