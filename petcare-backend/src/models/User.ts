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
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, "El email es obligatorio"],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Formato de email inválido"],
  },
  password: { type: String, required: true, minlength: 6 },
  otp: { type: String, default: null },
  otpExpires: { type: Date, default: null },
  firstLogin: { type: Boolean, default: true },
  name: String,
  phone: String,
});

// Hashear contraseña antes de guardar
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Método para comparar contraseñas
UserSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>("User", UserSchema);
