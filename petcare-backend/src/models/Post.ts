import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    image: { type: String, required: true },   // BASE64 🔥
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model("Post", PostSchema);
