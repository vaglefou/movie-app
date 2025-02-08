import { connectDb } from "./database";
import { seedSuperAdminUser } from "./seeds/super-admin.seed";
import { seedUserRoles } from "./seeds/user-roles.seed";

const seedDatabase = async (seedFunctions: Array<() => Promise<void>>) => {
  const connection = await connectDb();
  try {
    // Execute each seed function
    for (const seedFunction of seedFunctions) {
      await seedFunction();
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    // Disconnect from the database after seeding
    connection.disconnect();
  }
};


seedDatabase([seedUserRoles, seedSuperAdminUser]);
