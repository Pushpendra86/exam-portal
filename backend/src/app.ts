import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { errorHandler } from "./middlewares/error.middleware";
import { ApplicationContainer } from "./container";

import { authRoutes } from "./routes/auth.routes";
import { adminRoutes } from "./routes/admin.routes";
import { userRoutes } from "./routes/user.routes";
import { publicRoutes } from "./routes/public.routes";

export function createApp(container = new ApplicationContainer()): express.Application {
  const app = express();

  // Global middleware
  app.use(helmet());
  app.use(cors({ origin: "*" }));
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use("/api/v1", authRoutes(container.authController));
  app.use("/api/v1/admin", adminRoutes(container.adminController, container.authMiddleware));
  app.use("/api/v1/user", userRoutes(container.userController, container.authMiddleware));
  app.use("/api/v1/public", publicRoutes(container.publicController));

  // Health check
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // 404 handler
  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      message: "Invalid API. Use the official documentation to get the list of valid APIs.",
    });
  });

  // Error handler
  app.use(errorHandler);

  return app;
}
