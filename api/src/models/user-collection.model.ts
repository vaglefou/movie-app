import mongoose, { Schema, Document } from "mongoose";

export interface IUserCollection extends Document {
  movie: {
    title: string;
    year: string;
    imdbID: string;
    type: string;
    poster: string;
  };
  addedBy: mongoose.Schema.Types.ObjectId;
  attachedCollection: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

const userCollectionSchema: Schema = new Schema({
  movie: {
    title: { type: String, required: true },
    year: { type: String, required: true },
    imdbID: { type: String, required: false },
    type: { type: String, required: false },
    poster: { type: String, required: false },
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  attachedCollection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Collection",
    required: true,
  },
  createdAt: { type: Date, default: Date.now, required: true },
});

export default mongoose.model<IUserCollection>(
  "UserCollection",
  userCollectionSchema
);
