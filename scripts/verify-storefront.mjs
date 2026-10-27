import "dotenv/config";
import { chromium, expect } from "@playwright/test";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq, inArray } from "drizzle-orm";
import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { Pool } from "pg";
import { mkdir } from "node:fs/promises";

const base = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);
const orders = pgTable("spicy_orders", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 120 }),
  bundle: varchar("bundle", { length: 16 }),
  price: varchar("total_usd", { length: 12 }),
  shipping: varchar("shipping_usd", { length: 12 }),
});
const created = [];
const errors = [];
const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
await mkdir("artifacts", { recursive: true });

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(base, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const headingFont = await page.locator("h1").evaluate((element) => getComputedStyle(element).fontFamily);
  expect(headingFont).toContain("Georgia");
  expect(headingFont).not.toContain("ui-sans-serif");
  await expect(page.locator('input[name="product-pack"][value="popular"]')).toBeChecked();
  await expect(page.locator(".buy-button")).toContainText("$24.00");
  await page.screenshot({ path: "artifacts/storefront-desktop.png", fullPage: true });

  await page.locator('input[name="product-pack"][value="prueba"]').check();
  await expect(page.locator(".buy-button")).toContainText("$17.00");
  await page.locator('input[name="product-pack"][value="escapada"]').check();
  await expect(page.locator(".buy-button")).toContainText("$36.00");
  await page.locator('input[name="product-pack"][value="popular"]').check();

  await page.locator(".thumbnail").nth(1).click();
  await expect(page.locator(".gallery-counter")).toContainText("02 / 04");
  await page.locator(".zoom-button").click();
  await expect(page.locator(".zoom-dialog")).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator(".zoom-controls")).toContainText("3 / 4");
  await page.keyboard.press("Escape");
  await expect(page.locator(".zoom-dialog")).not.toBeVisible();
  await page.locator(".thumbnail").first().click();

  const firstQuote = await page.locator(".community-story blockquote").innerText();
  await page.getByRole("button", { name: "Siguiente testimonio", exact: true }).click();
  expect(await page.locator(".community-story blockquote").innerText()).not.toBe(firstQuote);
  await page.locator(".faq-questions summary").first().click();
  await expect(page.locator(".faq-questions details").first()).toHaveAttribute("open", "");
  await page.getByRole("button", { name: "Privacidad", exact: true }).click();
  await expect(page.locator(".policy-dialog")).toBeVisible();
  await page.keyboard.press("Escape");

  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow, `Horizontal overflow at ${width}px`).toBe(false);
  }

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
  mobile.on("pageerror", (error) => errors.push(error.message));
  await mobile.goto(base, { waitUntil: "networkidle" });
  await mobile.evaluate(() => document.fonts.ready);
  await mobile.screenshot({ path: "artifacts/storefront-mobile.png", fullPage: true });
  await mobile.locator(".sticky-purchase.is-visible .button-primary").click();
  await expect(mobile.locator(".checkout-dialog")).toBeVisible();
  await expect(mobile.locator("#checkout-pack")).toHaveValue("popular");
  await mobile.locator("#checkout-pack").selectOption("prueba");
  await expect(mobile.locator(".total-line")).toContainText("$17.00");
  await mobile.locator("#checkout-pack").selectOption("popular");
  await expect(mobile.locator(".total-line")).toContainText("$24.00");
  await mobile.screenshot({ path: "artifacts/checkout-mobile.png" });

  const suffix = Date.now();
  await mobile.locator('input[name="fullName"]').fill(`QA Storefront ${suffix}`);
  await mobile.locator('input[name="phone"]').fill("+58 412 000 0000");
  await mobile.locator('input[name="location"]').fill("Nueva Esparta, Pampatar");
  await mobile.locator('textarea[name="address"]').fill("Prueba automatizada, no despachar.");
  const responsePromise = mobile.waitForResponse((response) => response.url().endsWith("/api/orders") && response.request().method() === "POST");
  await mobile.locator(".checkout-submit").click();
  const response = await responsePromise;
  const result = await response.json();
  expect(response.status(), JSON.stringify(result)).toBe(201);
  created.push(result.orderId);
  await expect(mobile.locator(".checkout-success")).toBeVisible();
  await expect(mobile.locator(".receipt-total")).toContainText("$24.00");
  const [saved] = await db.select().from(orders).where(eq(orders.id, result.orderId));
  expect(saved.bundle).toBe("popular");
  expect(saved.price).toBe("24.00");
  expect(saved.shipping).toBe("0.00");

  for (const [bundle, price, shipping, total] of [["prueba", "12.00", "5.00", "17.00"], ["escapada", "36.00", "0.00", "36.00"]]) {
    const resultResponse = await page.request.post(`${base}/api/orders`, { data: {
      fullName: `QA Storefront ${suffix}`,
      phone: "+584120000000",
      location: "Margarita",
      address: "Prueba automatizada, no despachar.",
      bundle,
      totalUsd: "0.01",
    } });
    const data = await resultResponse.json();
    expect(resultResponse.status()).toBe(201);
    created.push(data.orderId);
    expect(data.totalUsd).toBe(total);
    const [record] = await db.select().from(orders).where(eq(orders.id, data.orderId));
    expect(record.price).toBe(price);
    expect(record.shipping).toBe(shipping);
  }
  for (const data of [null, {}, { bundle: "constructor" }]) {
    const invalid = await page.request.post(`${base}/api/orders`, { data });
    expect(invalid.status()).toBe(400);
  }
  expect(errors).toEqual([]);
  console.log("PASS: gallery, zoom, pack pricing, checkout, policies, reviews, FAQs, five responsive sizes, server validation and PostgreSQL persistence.");
  console.log("Screenshots saved in artifacts/.");
} finally {
  if (created.length) await db.delete(orders).where(inArray(orders.id, created));
  await browser.close();
  await pool.end();
}
