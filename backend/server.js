import { connectDb } from "./src/config/db.js";
import { env } from "./src/config/env.js";
import app from "./src/app.js";

async function startServer() {
  try {
    await connectDb();

    app.listen(env.port, () => {
      console.log(`Backend running on port ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start backend:", error);
    process.exit(1);
  }
}

startServer();
