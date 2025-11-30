import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  email: string;
  password: string;
  otp?: string | null;
  otpExpires?: Date | null;
  firstLogin: boolean;
  name?: string;
  phone?: string;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  otp: { type: String, default: null },
  otpExpires: { type: Date, default: null },
  firstLogin: { type: Boolean, default: true },
  name: String,
  phone: String,
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>("User", UserSchema);
