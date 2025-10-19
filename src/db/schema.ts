import { relations } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import { pgEnum, pgTable as table } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const usersTable = table(
	"users",
	{
		id: t
			.varchar("id", { length: 25 })
			.primaryKey()
			.$defaultFn(() => `usr_${nanoid(21)}`),

		firstName: t.text("first_name").notNull(),
		lastName: t.text("last_name").notNull(),

		email: t.text("email").notNull().unique(),
		password: t.text("password").notNull(),

		organizationId: t
			.varchar("organization_id", { length: 25 })
			.references(() => organizationsTable.id)
			.notNull(),

		dateCreated: t.timestamp("date_created").defaultNow().notNull(),
		dateUpdated: t.timestamp("date_updated").defaultNow().notNull(),
	},
	(table) => [t.index("idx_users_organization_id").on(table.organizationId)],
);

export const organizationsTable = table("organizations", {
	id: t
		.varchar("id", { length: 25 })
		.primaryKey()
		.$defaultFn(() => `org_${nanoid(21)}`),

	name: t.text("name").notNull(),

	// I would suggest adding a slug field here for better UX with path or subdomains
	// slug: t.text("slug").notNull().unique(),

	industry: t.text("industry").notNull(),

	dateFounded: t.date("date_founded").notNull(),

	dateCreated: t.timestamp("date_created").defaultNow().notNull(),
	dateUpdated: t.timestamp("date_updated").defaultNow().notNull(),
});

export const ordersTable = table("orders", {
	id: t
		.varchar("id", { length: 25 })
		.primaryKey()
		.$defaultFn(() => `ord_${nanoid(21)}`),

	orderDate: t.timestamp("order_date").defaultNow().notNull(),

	totalAmount: t.decimal("total_amount", { precision: 10, scale: 2 }).notNull(),

	userId: t
		.varchar("user_id", { length: 25 })
		.references(() => usersTable.id)
		.notNull(),
	organizationId: t
		.varchar("organization_id", { length: 25 })
		.references(() => organizationsTable.id)
		.notNull(),

	dateUpdated: t.timestamp("date_updated").defaultNow().notNull(),
});

export const orderRelations = relations(ordersTable, ({ one }) => ({
	user: one(usersTable, {
		fields: [ordersTable.userId],
		references: [usersTable.id],
	}),
	organization: one(organizationsTable, {
		fields: [ordersTable.organizationId],
		references: [organizationsTable.id],
	}),
}));
