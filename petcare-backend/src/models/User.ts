import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  otp?: string;
  otpExpires?: Date;
  firstLogin: boolean;
  name?: string;
  phone?: string;
  avatar?: string;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String },
  otpExpires: { type: Date },
  firstLogin: { type: Boolean, default: true },
  name: { type: String },
  phone: { type: String },
  avatar: { type: String },
});

export default mongoose.model<IUser>("User", UserSchema);
