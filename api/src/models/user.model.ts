import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: string;
  token: string | null;
  createdAt: Date;
}

const userSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  token: { type: String, required: false },
  createdAt: { type: Date, default: Date.now, required: true },
});

export default mongoose.model<IUser>("User", userSchema);
