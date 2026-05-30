import { connectDb } from "../src/config/db.js";
import { seedDemoData } from "../src/services/demoDataService.js";
import mongoose from "mongoose";

try {
  await connectDb();
  const { community } = await seedDemoData({ reset: true });
  console.log(`Demo data reset successfully for community: ${community.name}`);
} catch (error) {
  console.error("Failed to reset demo data:", error);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
