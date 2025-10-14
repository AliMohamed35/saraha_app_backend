import { connectDB } from "./DB/connection.js";
import { authRouter } from "./modules/index.js";

function bootstrap(app, express) {
  // connect DB
  connectDB();

  // middleware
  app.use(express.json());

  // routers
  app.use("/auth", authRouter);
  // app.use("/message", messageRouter);
  // app.use("/user", userRouter);
}

export default bootstrap;
