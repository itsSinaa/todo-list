import mongoose, { Schema } from "mongoose";
import { userModel } from "./User";

const todoScehma = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    userID: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const todoModel =
  mongoose.models.Todo || mongoose.model("Todo", todoScehma);
