import mongoose, { Schema, Document } from "mongoose";

export interface IVaccination {
  date: Date;
  vaccine: string;
  batch: string;
}

export interface IDeworming {
  date: Date;
  product: string;
  dose: string;
  nextDate?: Date;
}

export interface ITreatment {
  date: Date;
  treatment: string;
}

export interface IClinicalHistory {
  date: Date;
  description: string;
}

export interface IBirth {
  date: Date;
  puppies: number;
}

export interface IPetHistory extends Document {
  petId: mongoose.Types.ObjectId;
  vaccinations: IVaccination[];
  deworming: IDeworming[];
  treatments: ITreatment[];
  clinicalHistory: IClinicalHistory[];
  births: IBirth[];
}

const PetHistorySchema = new Schema<IPetHistory>(
  {
    petId: { type: Schema.Types.ObjectId, ref: "Pet", required: true },
    vaccinations: [
      {
        date: { type: Date, required: true },
        vaccine: { type: String, required: true },
        batch: { type: String },
      },
    ],
    deworming: [
      {
        date: { type: Date, required: true },
        product: { type: String, required: true },
        dose: { type: String },
        nextDate: { type: Date },
      },
    ],
    treatments: [
      {
        date: { type: Date, required: true },
        treatment: { type: String, required: true },
      },
    ],
    clinicalHistory: [
      {
        date: { type: Date, required: true },
        description: { type: String, required: true },
      },
    ],
    births: [
      {
        date: { type: Date, required: true },
        puppies: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IPetHistory>("PetHistory", PetHistorySchema);
