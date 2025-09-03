import { Schema, model, models } from "mongoose"

const UserSchema = new Schema(
  {
    email: { type: String, unique: true, index: true, required: true },
    name: { type: String, required: true },
    avatarUrl: String,
    passwordHash: { type: String, required: true },
    teams: [{ type: Schema.Types.ObjectId, ref: "Team" }],
  },
  { timestamps: true },
)

export const UserModel = models.User || model("User", UserSchema)
