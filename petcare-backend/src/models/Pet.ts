import mongoose, { Schema, Document } from "mongoose";

export interface IPet extends Document {
  name: string;
  species: string; // perro, gato, etc.
  breed?: string;
  age?: number;
  photo?: string;
  ownerId: mongoose.Types.ObjectId;
  
}

const PetSchema = new Schema<IPet>(
  {
    name: { type: String, required: true },
    species: { type: String, required: true },
    breed: { type: String },
    age: { type: Number },
    photo: { type: String }, // 👈 nuevo campo
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);


export default mongoose.model<IPet>("Pet", PetSchema);
