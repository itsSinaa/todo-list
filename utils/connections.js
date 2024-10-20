import mongoose from "mongoose";

export const connectToDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      return true;
    }

    await mongoose.connect("mongodb://localhost:27017/next-auth-v2");
    console.log("connected to db sucessfully");
  } catch (error) {
    console.log("err ->", error);
  }
};
