import "reflect-metadata";
import { config } from "./config";
import { initializeDatabase, AppDataSource } from "./config/database";
import { createApp } from "./app";
import { AuthService } from "./services/auth.service";
import { AdminRepository } from "./repositories/admin.repository";
import { UserRepository } from "./repositories/user.repository";

async function startServer() {
  try {
    await initializeDatabase();

    // Seed default admin
    const authService = new AuthService(new AdminRepository(), new UserRepository());
    await authService.initializeAdmin();

    const app = createApp();

    app.listen(config.PORT, () => {
      console.log(`Server Started. Server listening to port ${config.PORT}`);
      console.log(`Environment: ${config.NODE_ENV}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
