import { connectDB } from "./DB/connection.js";
import { authRouter, userRouter } from "./modules/index.js";
import cors from "cors";

function bootstrap(app, express) {
  // connect DB
  connectDB();

  // middleware
  app.use(express.json());

  // cors
  app.use(
    cors({
      origin: "*",
    })
  );

  // routers
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  // app.use("/message", messageRouter);
}

export default bootstrap;
