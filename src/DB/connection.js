import mongoose from "mongoose";

export function connectDB() {
  mongoose
    .connect(process.env.DB_URL)
    .then(() => {
      console.log("DB connected successfully");
    })
    .catch((err) => {
      console.log("failed to connect to DB", err.message);
    });
}
