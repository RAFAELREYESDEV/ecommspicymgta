import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const spicyOrders = pgTable("spicy_orders", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  location: varchar("location", { length: 160 }).notNull(),
  address: text("address").notNull(),
  deliveryNotes: text("delivery_notes"),
  bundle: varchar("bundle", { length: 16 }).notNull(),
  bundleName: varchar("bundle_name", { length: 100 }).notNull(),
  totalUsd: varchar("total_usd", { length: 12 }).notNull(),
  shippingUsd: varchar("shipping_usd", { length: 12 }).notNull().default("0.00"),
  status: varchar("status", { length: 20 }).notNull().default("new"),
  source: varchar("source", { length: 80 }).notNull().default("landing"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
