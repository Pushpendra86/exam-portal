import "reflect-metadata";
import { config } from "./config";
import { initializeDatabase, AppDataSource } from "./config/database";
import { createApp } from "./app";
import { ApplicationContainer } from "./container";

async function startServer() {
  try {
    await initializeDatabase();

    const container = new ApplicationContainer(AppDataSource);
    await container.authService.initializeAdmin();

    const app = createApp(container);

    const server = app.listen(config.PORT, () => {
      console.log(`Server Started. Server listening to port ${config.PORT}`);
      console.log(`Environment: ${config.NODE_ENV}`);
    });

    server.on("error", (err: NodeJS.ErrnoException) => {
      if (err.code === "EADDRINUSE") {
        console.error(
          `Port ${config.PORT} is already in use. Stop the existing process or set PORT to another value.`
        );
      } else {
        console.error("Server failed to start:", err);
      }
      process.exit(1);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
