import { Schema, model, models } from "mongoose"

const FileSchema = new Schema(
  {
    teamId: { type: Schema.Types.ObjectId, ref: "Team", index: true, required: true },
    uploaderId: { type: Schema.Types.ObjectId, ref: "User", index: true, required: true },
    name: { type: String, required: true },
    contentType: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

export const FileModel = models.File || model("File", FileSchema)
