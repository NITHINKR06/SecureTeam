import { Schema, model, models } from "mongoose"

const TeamSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, index: true, required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
)

export const TeamModel = models.Team || model("Team", TeamSchema)
