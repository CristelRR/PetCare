import mongoose, { Schema, Document } from "mongoose";

export interface IPet extends Document {
  name: string;
  breed?: string; // Raza
  birthDate?: Date; // Fecha de nacimiento
  sex?: string; // "Hembra" o "Macho"
  color?: string;
  marks?: string; // Señales particulares
  photo?: string;
  ownerId: mongoose.Types.ObjectId;
}

const PetSchema = new Schema<IPet>(
  {
    name: { type: String, required: true },
    breed: { type: String },
    birthDate: { type: Date },
    sex: { type: String, enum: ["Hembra", "Macho"] },
    color: { type: String },
    marks: { type: String },
    photo: { type: String },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IPet>("Pet", PetSchema);
