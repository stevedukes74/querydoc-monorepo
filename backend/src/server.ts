import { createApp } from "./app";
import { config, validateConfig } from "./config/env";

// Validate configuration
try {
  validateConfig();
} catch (error) {
  console.error("Configuration error:", error);
  process.exit(1);
}

// Start server when run directly
if (require.main === module) {
  const app = createApp();

  app.listen(config.port, () => {
    console.log(`🚀 QueryDoc backend running on port ${config.port}`);
    console.log(`Environment: ${config.nodeEnv}`);
  });
}

export { createApp };
