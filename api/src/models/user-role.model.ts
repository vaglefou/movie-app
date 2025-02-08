import mongoose, { Schema, Document } from "mongoose";

export interface IUserRole extends Document {
  name: string;
  createdAt: Date;
}

const userRoleSchema: Schema = new Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
});

export default mongoose.model<IUserRole>("UserRole", userRoleSchema);
