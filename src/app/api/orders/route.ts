import { NextRequest, NextResponse } from "next/server";
import { getBundle } from "@/lib/product";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

type OrderPayload = {
  fullName?: unknown;
  phone?: unknown;
  state?: unknown;
  location?: unknown;
  address?: unknown;
  deliveryNotes?: unknown;
  paymentMethod?: unknown;
  paymentReference?: unknown;
  bundle?: unknown;
};

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return null;
  const cleaned = value.replace(/\s+/g, " ").trim();
  if (!cleaned || cleaned.length > maxLength) return null;
  return cleaned;
}

const DATA_DIR = path.join(process.cwd(), "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

function saveOrderLocal(orderData: Record<string, unknown>): number {
  const fallbackId = Math.floor(100 + (Date.now() % 9000));
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    let orders: Array<Record<string, unknown>> = [];
    if (fs.existsSync(ORDERS_FILE)) {
      try {
        orders = JSON.parse(fs.readFileSync(ORDERS_FILE, "utf-8"));
      } catch {
        orders = [];
      }
    }

    const newId = orders.length > 0 ? (Number(orders[orders.length - 1].id) || 100) + 1 : 101;
    const finalOrder = { id: newId, ...orderData, createdAt: new Date().toISOString() };
    orders.push(finalOrder);
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");

    return newId;
  } catch (err) {
    console.warn("Storage notice (read-only filesystem / edge runtime):", err);
    return fallbackId;
  }
}

export async function POST(request: NextRequest) {
  let payload: OrderPayload;
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Revisa los datos de tu pedido." }, { status: 400 });
    }
    payload = body as OrderPayload;
  } catch {
    return NextResponse.json({ error: "No pudimos leer la solicitud." }, { status: 400 });
  }

  const fullName = cleanText(payload.fullName, 120);
  const phone = cleanText(payload.phone, 32);
  const state = cleanText(payload.state, 80) || "Nueva Esparta (Margarita)";
  const location = cleanText(payload.location, 160) || state;
  const address = cleanText(payload.address, 600) || "Coordinar entrega por WhatsApp";
  const deliveryNotes = cleanText(payload.deliveryNotes, 500);
  const paymentMethod = cleanText(payload.paymentMethod, 80) || "COD (Pago al recibir)";
  const paymentReference = cleanText(payload.paymentReference, 120);
  const selectedBundle = getBundle(payload.bundle);

  if (!fullName || !phone || !selectedBundle) {
    return NextResponse.json({
      error: "Por favor indica tu nombre, WhatsApp y el pack seleccionado.",
    }, { status: 400 });
  }

  const normalizedPhone = phone.replace(/[\s()-]/g, "");
  if (!/^\+?\d{7,20}$/.test(normalizedPhone)) {
    return NextResponse.json({ error: "Escribe un número de WhatsApp válido (ej. 0412 1234567)." }, { status: 400 });
  }

  try {
    const orderId = saveOrderLocal({
      fullName,
      phone: normalizedPhone,
      state,
      location: location || state,
      address,
      deliveryNotes: deliveryNotes || null,
      bundle: selectedBundle.id,
      bundleName: selectedBundle.orderName,
      totalUsd: selectedBundle.price.toFixed(2),
      cryptoUsd: selectedBundle.cryptoPrice.toFixed(2),
      shippingUsd: selectedBundle.shipping.toFixed(2),
      paymentMethod,
      paymentReference: paymentReference || null,
    });

    const isExpress = state.toLowerCase().includes("margarita") || state.toLowerCase().includes("nueva esparta");

    return NextResponse.json({
      ok: true,
      orderId,
      isExpress,
      totalUsd: (Number(selectedBundle.price) + Number(selectedBundle.shipping)).toFixed(2),
      cryptoUsd: (Number(selectedBundle.cryptoPrice) + Number(selectedBundle.shipping)).toFixed(2),
    }, { status: 201 });
  } catch (error) {
    console.error("Error guardando orden local", error);
    return NextResponse.json({
      error: "No pudimos registrar tu pedido. Intenta de nuevo o escríbenos por WhatsApp.",
    }, { status: 500 });
  }
}
