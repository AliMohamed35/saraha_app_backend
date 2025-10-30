import rateLimit from "express-rate-limit";
import { connectDB } from "./DB/connection.js";
import { authRouter, userRouter } from "./modules/index.js";
import { globalErrorHandler } from "./utils/error/index.js";
import cors from "cors";

function bootstrap(app, express) {
  const limiter = rateLimit({
    windowMs: 60 * 1000, // request every 1 min
    limit: 3,
    handler: (req, res, next, options) => {
      throw new Error("rate limit exceeded", { cause: 400 });
    },
    skipSuccessfulRequests: true,
    identifier: (req, res, next) => {
      return req.ip; // device ip
    },
  });

  // middleware
  app.use(limiter);
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
  app.use(globalErrorHandler);

  // connect DB
  connectDB();
}

export default bootstrap;
