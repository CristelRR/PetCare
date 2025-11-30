import { Schema, model, Document } from "mongoose";

export interface IComment {
  userId: string;
  userName: string;
  text: string;
  date: Date;
}

export interface IPost extends Document {
  userId: string;
  userName: string;
  userAvatar?: string | null;
  imageUrl: string;
  description: string;
  likes: string[];
  comments: IComment[];
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const PostSchema = new Schema<IPost>({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userAvatar: { type: String, default: null },

  imageUrl: { type: String, required: true },
  description: { type: String, default: "" },

  likes: { type: [String], default: [] },
  comments: { type: [CommentSchema], default: [] },

  createdAt: { type: Date, default: Date.now },
});

export default model<IPost>("Post", PostSchema);
