import mongoose, { Schema, Document } from "mongoose";

export interface ICollection extends Document {
  name: string;
  createdBy: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

const collectionSchema: Schema = new Schema({
  name: { type: String, required: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now, required: true }
});

export default mongoose.model<ICollection>("Collection", collectionSchema);
