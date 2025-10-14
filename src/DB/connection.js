import mongoose from "mongoose";

export function connectDB() {
  mongoose
    .connect("mongodb://127.0.0.1/saraha-app")
    .then(() => {
      console.log("DB connected successfully");
    })
    .catch((err) => {
      console.log("failed to connect to DB", err.message);
    });
}
