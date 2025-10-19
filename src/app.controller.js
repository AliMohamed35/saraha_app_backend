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

  // global error handler
  app.use((error, req, res, next) => {
    res.status(error.cause || 500).json({
      message: error.message,
      success: false,
      // stack: error.stack,
      globalErrorHandler: true,
    });
  });
}

export default bootstrap;
