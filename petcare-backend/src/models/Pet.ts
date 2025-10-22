import mongoose, { Schema, Document } from "mongoose";

export interface IPet extends Document {
  name: string;
  birth: string; // o Date si quieres
  photo: string; // nombre de archivo o URL
  owner: string; // id del usuario dueño de la mascota (opcional)
}

const PetSchema: Schema = new Schema({
  name: { type: String, required: true },
  birth: { type: String, required: true },
  photo: { type: String, required: true },
  owner: { type: String, required: true }, // si quieres relacionarlo con usuario
});

export default mongoose.model<IPet>("Pet", PetSchema);
