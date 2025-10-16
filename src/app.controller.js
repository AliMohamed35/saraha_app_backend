import { connectDB } from "./DB/connection.js";
import { authRouter, userRouter } from "./modules/index.js";

function bootstrap(app, express) {
  // connect DB
  connectDB();

  // middleware
  app.use(express.json());

  // routers
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  // app.use("/message", messageRouter);
}

export default bootstrap;
