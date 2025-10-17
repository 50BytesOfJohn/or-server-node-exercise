import "dotenv/config";

import { drizzle } from "drizzle-orm/node-postgres";

import {
  organizationsTable,
  usersTable,
  ordersTable,
} from "../src/db/schema.js";

import { nanoid } from "nanoid";

const db = drizzle(process.env.DATABASE_URL!);

async function seedDatabase() {
  console.log("🌱 Seeding database...");

  try {
    // Create organization
    const organizationId = `org_${nanoid(21)}`;
    const organization = await db
      .insert(organizationsTable)
      .values({
        id: organizationId,
        name: "Acme Corporation",
        industry: "Technology",
        dateFounded: "2020-01-15",
      })
      .returning();

    console.log("✅ Created organization:", organization[0]);

    // Create user
    const userId = `usr_${nanoid(21)}`;
    const user = await db
      .insert(usersTable)
      .values({
        id: userId,
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@acme.com",
        organizationId: organizationId,
      })
      .returning();

    console.log("✅ Created user:", user[0]);

    // Create order
    const orderId = `ord_${nanoid(21)}`;
    const order = await db
      .insert(ordersTable)
      .values({
        id: orderId,
        totalAmount: "299.99",
        userId: userId,
        organizationId: organizationId,
      })
      .returning();

    console.log("✅ Created order:", order[0]);

    console.log("🎉 Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
