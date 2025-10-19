import "dotenv/config";

import { drizzle } from "drizzle-orm/node-postgres";
import { nanoid } from "nanoid";
import {
	ordersTable,
	organizationsTable,
	usersTable,
} from "../src/db/schema.js";
import { hashPassword } from "../src/modules/auth/utils.js";

const db = drizzle(process.env.DATABASE_URL!);

async function seedDatabase() {
	console.log("🌱 Seeding database...");

	try {
		const organizations = [
			{
				name: "Acme Corporation",
				industry: "Technology",
				dateFounded: "2020-01-15",
			},
			{
				name: "Globex Industries",
				industry: "Manufacturing",
				dateFounded: "2018-03-22",
			},
		];

		const users = [
			{ firstName: "John", lastName: "Doe", email: "john.doe@acme.com" },
			{ firstName: "Jane", lastName: "Smith", email: "jane.smith@acme.com" },
			{
				firstName: "Michael",
				lastName: "Johnson",
				email: "michael.johnson@acme.com",
			},
			{
				firstName: "Sarah",
				lastName: "Williams",
				email: "sarah.williams@acme.com",
			},
			{ firstName: "David", lastName: "Brown", email: "david.brown@acme.com" },
			{ firstName: "Emily", lastName: "Davis", email: "emily.davis@acme.com" },
			{
				firstName: "Chris",
				lastName: "Wilson",
				email: "chris.wilson@acme.com",
			},

			{
				firstName: "Alex",
				lastName: "Garcia",
				email: "alex.garcia@globex.com",
			},
			{
				firstName: "Maria",
				lastName: "Rodriguez",
				email: "maria.rodriguez@globex.com",
			},
			{
				firstName: "Robert",
				lastName: "Miller",
				email: "robert.miller@globex.com",
			},
		];

		const createdOrganizations = [];
		for (const orgData of organizations) {
			const organizationId = `org_${nanoid(21)}`;
			const organization = await db
				.insert(organizationsTable)
				.values({
					id: organizationId,
					name: orgData.name,
					industry: orgData.industry,
					dateFounded: orgData.dateFounded,
				})
				.returning();

			createdOrganizations.push(organization[0]);
			console.log(`✅ Created organization: ${organization[0].name}`);
		}

		const createdUsers = [];
		for (let i = 0; i < users.length; i++) {
			const userData = users[i];
			const userId = `usr_${nanoid(21)}`;
			const userPassword = await hashPassword(userData.email);

			const organizationId =
				i < 7 ? createdOrganizations[0].id : createdOrganizations[1].id;

			const user = await db
				.insert(usersTable)
				.values({
					id: userId,
					firstName: userData.firstName,
					lastName: userData.lastName,
					email: userData.email,
					password: userPassword,
					organizationId: organizationId,
				})
				.returning();

			createdUsers.push(user[0]);
			console.log(
				`✅ Created user: ${user[0].firstName} ${user[0].lastName} (${user[0].email})`,
			);
		}

		const orderAmounts = [
			"299.99",
			"149.50",
			"75.25",
			"450.00",
			"89.99",
			"1200.50",
			"35.75",
			"680.25",
			"245.90",
			"99.99",
			"520.00",
			"67.45",
			"890.75",
			"156.30",
			"340.20",
			"78.95",
			"1250.00",
			"45.60",
			"395.85",
			"180.40",
		];

		const createdOrders = [];
		for (let i = 0; i < 20; i++) {
			const orderId = `ord_${nanoid(21)}`;

			const userIndex = i % createdUsers.length;
			const user = createdUsers[userIndex];

			const daysAgo = Math.floor(Math.random() * 365) + 1;
			const orderDate = new Date();
			orderDate.setDate(orderDate.getDate() - daysAgo);

			const order = await db
				.insert(ordersTable)
				.values({
					id: orderId,
					orderDate: orderDate,
					totalAmount: orderAmounts[i],
					userId: user.id,
					organizationId: user.organizationId,
				})
				.returning();

			createdOrders.push(order[0]);
			console.log(
				`✅ Created order ${i + 1}: $${order[0].totalAmount} for ${
					user.firstName
				} ${user.lastName}`,
			);
		}

		console.log("🎉 Database seeded successfully!");
		console.log(
			`📊 Summary: ${createdOrganizations.length} organizations, ${createdUsers.length} users, ${createdOrders.length} orders`,
		);
	} catch (error) {
		console.error("❌ Error seeding database:", error);
		process.exit(1);
	}
}

seedDatabase()
	.then(() => {
		console.log("✅ Script execution completed");
		process.exit(0);
	})
	.catch((error) => {
		console.error("❌ Unhandled error in seed script:", error);
		process.exit(1);
	});
