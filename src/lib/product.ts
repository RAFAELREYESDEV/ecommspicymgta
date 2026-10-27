export type BundleId = "prueba" | "popular" | "escapada";

export type ProductBundle = {
  id: BundleId;
  name: string;
  orderName: string;
  quantity: number;
  price: number;
  cryptoPrice: number; // 15% de descuento en USDT / Divisa en efectivo
  regularPrice: number;
  shipping: number;
  offer: string;
  shippingLabel: string;
  hasFreeShipping: boolean;
};

export const PRODUCT_BUNDLES: readonly ProductBundle[] = [
  {
    id: "prueba",
    name: "Primera cita",
    orderName: "Combo Prueba · 1 bolsita (1 par / 1 cita)",
    quantity: 1,
    price: 12,
    cryptoPrice: 10.5, // 15% OFF (queda en 10.50 USDT)
    regularPrice: 12,
    shipping: 0, // Flete cobro a destino
    hasFreeShipping: false,
    offer: "Para probar",
    shippingLabel: "Envío NO incluido (Cobro a destino)",
  },
  {
    id: "popular",
    name: "Más noches juntos",
    orderName: "Lleva 2 y la 3ra GRATIS · 3 bolsitas (3 citas)",
    quantity: 3,
    price: 24,
    cryptoPrice: 20.4, // 15% OFF en 24 USD = 20.40 USDT
    regularPrice: 36,
    shipping: 0,
    hasFreeShipping: true,
    offer: "2 + 1 gratis",
    shippingLabel: "Envío 100% GRATIS",
  },
  {
    id: "escapada",
    name: "Pack escapada",
    orderName: "Pack Escapada · 5 bolsitas (5 citas)",
    quantity: 5,
    price: 36,
    cryptoPrice: 30.6, // 15% OFF en 36 USD = 30.60 USDT
    regularPrice: 60,
    shipping: 0,
    hasFreeShipping: true,
    offer: "Lleva 5, paga 3",
    shippingLabel: "Envío VIP 100% GRATIS",
  },
];

export const DEFAULT_BUNDLE = PRODUCT_BUNDLES[1];

export function getBundle(id: unknown): ProductBundle | undefined {
  return PRODUCT_BUNDLES.find((bundle) => bundle.id === id);
}

export function money(value: number): string {
  return `$${value.toFixed(2)}`;
}

export function cryptoMoney(value: number): string {
  return `${value.toFixed(2)} USDT`;
}

export function bagLabel(quantity: number): string {
  return `${quantity} ${quantity === 1 ? "bolsita" : "bolsitas"}`;
}
