"use client";

import Image from "next/image";
import { type FormEvent, type ReactNode, useEffect, useRef, useState } from "react";
import {
  bagLabel,
  cryptoMoney,
  DEFAULT_BUNDLE,
  getBundle,
  money,
  PRODUCT_BUNDLES,
  type BundleId,
} from "@/lib/product";
import pouch from "../../public/images/pouch-single.jpg";
import night from "../../public/images/pouches-hand-night.jpg";
import flatlay from "../../public/images/photo-flatlay-branded.jpg";
import deliveryNight from "../../public/images/entrega-real-noche.jpg";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const SUPPORT = "https://wa.me/584227201945";
const CHANNEL = "https://whatsapp.com/channel/0029Vb9Rbj3GZNCxZHBnsC0h";

const photos = [
  { src: pouch, alt: "Bolsita individual Spicy Cubbes con un par de cubos en mesa", label: "El original" },
  { src: night, alt: "Bolsita Spicy Cubbes sostenida en la mano lista para una cita", label: "En mano" },
  { src: flatlay, alt: "Bolsita oficial Spicy Cubbes cenital con dos cubitos de ají", label: "La dosis perfecta" },
];

const stories = [
  {
    quote: "Al principio pensé que era pura publicidad, pero el sabor a durazno con picantico es genial.",
    name: "Carlos R.",
    place: "Porlamar, Margarita",
  },
  {
    quote: "El delivery llegó súper rápido y venía en un sobre totalmente sellado sin nada raro por fuera. Gracias por la discreción.",
    name: "Andrea S.",
    place: "Caracas",
  },
  {
    quote: "Mi novio y yo teníamos meses en la monotonía y ayer probamos las gomitas… ¡10/10!",
    name: "Valeria M.",
    place: "Pampatar, Margarita",
  },
];

const questions = [
  { question: "¿Una bolsita es para los dos?", answer: "Sí. Cada bolsita individual trae exactamente un par: 2 cubos, uno para cada persona. Una bolsita está pensada para una sola cita." },
  { question: "¿Es muy picante?", answer: "El sabor comienza con el dulzor del durazno y termina con un toque de ají. La tolerancia al picante es personal; disfrútenlo despacio y sigan las indicaciones del empaque." },
  { question: "¿Cómo llega mi pedido?", answer: "En sobre o caja exterior neutra, 100% sellada y sin referencias al contenido (sobre ciego). Máxima discreción garantizada." },
  { question: "¿Cuánto cuesta el envío?", answer: "Para la bolsita individual ($12) el flete es cobro a destino (en Margarita el motorizado por cuenta del cliente; nacional por Zoom o MRW en agencia). Para los packs de 3 bolsitas ($24) y 5 bolsitas ($36) el envío es 100% GRATIS." },
  { question: "¿Cuándo y cómo pago?", answer: "Pagas mediante Pago Móvil a banco Mercantil o por Binance USDT con 15% de descuento especial. También coordinamos pago en efectivo en divisas al momento de confirmar el pedido." },
];

type IconName = "arrow" | "chevron" | "bag" | "box" | "truck" | "leaf" | "lock" | "check" | "close" | "zoom" | "message" | "heart" | "music" | "pepper" | "gift";

function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: <><path d="M4 12h15M13 5l7 7-7 7" /></>,
    chevron: <path d="m8 4 8 8-8 8" />,
    bag: <><path d="M5 7h14l1 14H4L5 7Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>,
    box: <><path d="m12 3 9 5v9l-9 5-9-5V8l9-5Z" /><path d="m3 8 9 5 9-5M12 13v9M7.5 5.5l9 5" /></>,
    truck: <><path d="M3 5h11v12H3zM14 10h4l3 4v3h-7" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></>,
    leaf: <><path d="M20 3C7 2 2 8 5 16c8 5 16-1 15-13Z" /><path d="M3 21 16 8M10 14v-4M10 14h5" /></>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    zoom: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5M7.5 10.5h6M10.5 7.5v6" /></>,
    message: <><path d="M21 11.5a9 9 0 0 1-13 8L3 21l1.5-5A9 9 0 1 1 21 11.5Z" /><path d="M8 11h8M8 14h5" /></>,
    heart: <path d="M20.5 4.5a5 5 0 0 0-7.1 0L12 6l-1.4-1.5a5 5 0 1 0-7.1 7.1L12 20l8.5-8.4a5 5 0 0 0 0-7.1Z" />,
    music: <><path d="M10 18V6l10-3v12M10 9l10-3" /><ellipse cx="7" cy="18" rx="3" ry="2.5" /><ellipse cx="17" cy="15" rx="3" ry="2.5" /></>,
    pepper: <><path d="M19 7c-3-3-7-1-8 2C8 15 6 18 2 19c8 3 18-2 19-8 .4-2-.6-3.3-2-4Z" /><path d="M18 7c2-2 2-4 0-5M7 18c5-1 9-4 10-8" /></>,
    gift: <><path d="M3 9h18v4H3zM5 13v8h14v-8M12 9v12" /><path d="M12 9C5 9 5 3 8 3c2 0 4 4 4 6Zm0 0c7 0 7-6 4-6-2 0-4 4-4 6Z" /></>,
  };
  return <svg className={`icon ${className}`} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function Wordmark({ large = false }: { large?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 font-black uppercase tracking-wider ${large ? "text-2xl text-[#55242e]" : "text-2xl text-[#743441]"}`}>
      <Image src="/images/logo-header.png" alt="Logo Spicy Cubbes" width={large ? 44 : 42} height={large ? 44 : 42} className="inline-block object-contain" />
      <span className="font-extrabold text-[#743441] tracking-tight text-[1.55rem] leading-none">SPICY CUBBES<span className="text-[#e11d48]">.</span></span>
    </span>
  );
}

function track(event: string, parameters?: Record<string, unknown>) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", event, parameters);
  }
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
}

type FormValues = {
  fullName: string;
  phone: string;
  paymentReference: string;
};
type Receipt = { id: number; bundle: BundleId; total: number; isExpress: boolean; phone: string };

export default function SpicyLanding() {
  const [bundleId, setBundleId] = useState<BundleId>("popular");
  const [photoIndex, setPhotoIndex] = useState(0);
  const [storyIndex, setStoryIndex] = useState(0);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [policy, setPolicy] = useState<"privacy" | "shipping" | null>(null);
  const [hasOrder, setHasOrder] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const [showExpressPay, setShowExpressPay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [form, setForm] = useState<FormValues>({
    fullName: "",
    phone: "",
    paymentReference: "",
  });
  const checkoutRef = useRef<HTMLDialogElement>(null);
  const zoomRef = useRef<HTMLDialogElement>(null);
  const policyRef = useRef<HTMLDialogElement>(null);
  const purchaseRef = useRef<HTMLDivElement>(null);
  const productRef = useRef<HTMLElement>(null);
  const checkoutTracked = useRef(false);
  const submitting = useRef(false);

  const selected = getBundle(bundleId) ?? DEFAULT_BUNDLE;
  const total = selected.price + selected.shipping;
  const cryptoTotal = selected.cryptoPrice + selected.shipping;
  const saving = selected.regularPrice - selected.price;
  const photo = photos[photoIndex];
  const story = stories[storyIndex];
  const receiptBundle = receipt ? getBundle(receipt.bundle) : null;

  useEffect(() => {
    const target = productRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        track("ViewContent", { content_name: "Spicy Cubes · 1 par", content_type: "product" });
        observer.disconnect();
      }
    }, { threshold: 0.15 });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const target = purchaseRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setShowSticky(!entry.isIntersecting), { threshold: 0.2 });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const dialog = checkoutRef.current;
    if (!dialog) return;
    if (checkoutOpen && !dialog.open) dialog.showModal();
    if (!checkoutOpen && dialog.open) dialog.close();
  }, [checkoutOpen]);

  useEffect(() => {
    const dialog = zoomRef.current;
    if (!dialog) return;
    if (zoomOpen && !dialog.open) dialog.showModal();
    if (!zoomOpen && dialog.open) dialog.close();
  }, [zoomOpen]);

  useEffect(() => {
    const dialog = policyRef.current;
    if (!dialog) return;
    if (policy && !dialog.open) dialog.showModal();
    if (!policy && dialog.open) dialog.close();
  }, [policy]);

  useEffect(() => {
    if (!checkoutOpen && !zoomOpen && !policy) return;
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = before; };
  }, [checkoutOpen, zoomOpen, policy]);

  function beginCheckout() {
    if (!checkoutTracked.current) {
      checkoutTracked.current = true;
      track("InitiateCheckout", { content_name: selected.name, value: total, currency: "USD" });
    }
  }

  function selectBundle(id: BundleId) {
    setBundleId(id);
    setReceipt(null);
    setError("");
    beginCheckout();
  }

  function openCheckout() {
    beginCheckout();
    setHasOrder(true);
    setCheckoutOpen(true);
  }

  function changePhoto(direction: number) {
    setPhotoIndex((index) => (index + direction + photos.length) % photos.length);
  }

  function updateField(field: keyof FormValues, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          phone: form.phone,
          bundle: bundleId,
          paymentMethod: showExpressPay ? "pago_movil_express" : "whatsapp",
          paymentReference: showExpressPay ? form.paymentReference : undefined,
        }),
      });
      const data = await response.json() as { ok?: boolean; orderId?: number; isExpress?: boolean; error?: string };
      if (!response.ok || !data.ok || !data.orderId) throw new Error(data.error || "No pudimos registrar tu pedido.");
      setReceipt({ id: data.orderId, bundle: bundleId, total, isExpress: !!data.isExpress, phone: form.phone });
      track("Purchase", { content_name: selected.name, value: total, currency: "USD", num_items: selected.quantity });
      track("Lead", { content_name: selected.name, value: total, currency: "USD" });

      const waMsg = showExpressPay
        ? `Hola! Acabo de registrar mi pedido #${data.orderId} en la web con Pago Express. Combo: ${bagLabel(selected.quantity)} (${money(total)}). Nombre: ${form.fullName}. ${form.paymentReference ? `Referencia: ${form.paymentReference}. ` : ""}Adjunto comprobante para despachar.`
        : `Hola! Acabo de registrar mi pedido #${data.orderId} en la web. Combo: ${bagLabel(selected.quantity)} (${money(total)}). Nombre: ${form.fullName}. Quedo atento a su llamada o mensaje para confirmar.`;
      const waUrl = `${SUPPORT}?text=${encodeURIComponent(waMsg)}`;
      if (typeof window !== "undefined") {
        window.open(waUrl, "_blank");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error. Intenta de nuevo.");
    } finally {
      submitting.current = false;
      setLoading(false);
    }
  }

  return (
    <>
      <a className="skip-link" href="#producto">Ir al producto</a>
      <div className="announcement">
        <span><Icon name="truck" /> <b>Envíos a toda Venezuela en sobre 100% ciego y sellado</b></span>
        <span className="announcement-extra"><Icon name="message" /> Atención directa por WhatsApp</span>
      </div>

      <header className="site-header">
        <div className="header-inner page-width">
          <nav className="header-nav" aria-label="Navegación principal">
            <a href="#producto">Las gomitas</a>
            <a href="#el-ritual">El ritual</a>
            <a href="#preguntas">Preguntas</a>
          </nav>
          <a href="#" className="brand-link" aria-label="Spicy Cubes — Inicio"><Wordmark /></a>
          <div className="header-actions">
            <span className="market-label">Venezuela · USD</span>
            <a href={SUPPORT} target="_blank" rel="noreferrer" className="support-link" aria-label="Hablemos por WhatsApp"><Icon name="message" /><span>Hablemos</span></a>
            <button className="cart-button" onClick={openCheckout} aria-label="Abrir mi pedido"><Icon name="bag" /><span>{hasOrder ? "1" : "0"}</span></button>
          </div>
        </div>
      </header>

      <main>
        <section className="product-section page-width" id="producto" ref={productRef}>
          <div className="breadcrumb"><a href="#">Inicio</a><span>/</span><span>Un plan para dos</span></div>
          <div className="product-layout">
            <div className="product-gallery" aria-label="Fotografías del producto">
              <div className="gallery-stage" onKeyDown={(event) => { if (event.key === "ArrowRight") changePhoto(1); if (event.key === "ArrowLeft") changePhoto(-1); }}>
                <button className="gallery-main" onClick={() => setZoomOpen(true)} aria-label={`Ampliar imagen: ${photo.label}`}>
                  <Image key={photoIndex} src={photo.src} alt={photo.alt} fill priority={photoIndex === 0} placeholder="blur" sizes="(max-width: 780px) calc(100vw - 36px), (max-width: 1150px) 50vw, 630px" quality={75} />
                </button>
                <span className="gallery-label">SPICY CUBBES · EL ORIGINAL</span>
                <span className="adult-tag">18+</span>
                <span className="photo-caption">Hechas para compartir.</span>
                <button className="zoom-button" onClick={() => setZoomOpen(true)} aria-label="Ver fotografía ampliada"><Icon name="zoom" /></button>
              </div>
              <div className="gallery-bottom">
                <div className="gallery-thumbnails">
                  {photos.map((item, index) => <button key={item.label} className={`thumbnail ${index === photoIndex ? "is-active" : ""}`} onClick={() => setPhotoIndex(index)} aria-label={`Ver: ${item.label}`} aria-pressed={index === photoIndex}><Image src={item.src} alt="" fill sizes="72px" /><span className="sr-only">{item.label}</span></button>)}
                </div>
                <div className="gallery-counter"><span>{String(photoIndex + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}</span><button onClick={() => changePhoto(1)} aria-label="Siguiente fotografía"><Icon name="arrow" /></button></div>
              </div>
              <p className="gallery-footnote">Un par de cubitos. Un montón de planes posibles.</p>
            </div>

            <div className="product-information">
              <div className="product-kicker"><span>GOMITAS PARA COMPARTIR</span><span>HECHO PARA DOS</span></div>
              <h1>Un poquito dulce.<br /><em>Un poquito spicy.</em></h1>
              <p className="product-name">Spicy Cubbes · Durazno & ají</p>
              <p className="product-description">Dos cubitos, uno para cada uno. El dulzor del durazno, un toque de ají y una buena excusa para hacer de cualquier noche <em>su noche.</em></p>
              <div className="product-price" aria-live="polite">
                <span>{money(selected.price)}</span>
                {saving > 0 && <><del>{money(selected.regularPrice)}</del><span className="saving-tag">Ahorras ${saving}</span></>}
                <small>USD</small>
              </div>
              <div className="crypto-badge-box">
                <span className="crypto-pill">🔥 15% OFF en USDT / Divisa</span>
                <span className="crypto-price-text">Pagas solo <strong>{cryptoMoney(selected.cryptoPrice)}</strong> en Binance o efectivo</span>
              </div>
              <p className="selected-description">{bagLabel(selected.quantity)} · {selected.quantity * 2} cubos · {selected.quantity} {selected.quantity === 1 ? "cita" : "citas"}</p>

              <fieldset className="pack-picker">
                <legend>Elige tus próximas citas <small>1 bolsita = 1 par</small></legend>
                <div className="pack-options">
                  {PRODUCT_BUNDLES.map((item) => (
                    <label className={`pack-option ${bundleId === item.id ? "is-selected" : ""} ${item.id === "popular" ? "pack-popular" : ""}`} key={item.id}>
                      {item.id === "popular" && <span className="pack-ribbon">2 + 1 gratis</span>}
                      <input type="radio" name="product-pack" value={item.id} checked={bundleId === item.id} onChange={() => selectBundle(item.id)} />
                      <span className="pack-radio"><Icon name="check" /></span>
                      <strong>{item.quantity} {item.quantity === 1 ? "cita" : "citas"}</strong>
                      <span className="pack-quantity">{bagLabel(item.quantity)}</span>
                      <b>{money(item.price)}</b>
                      <span className="per-date-tag">
                        {item.id === "popular" ? "¡Solo $8 por cita!" : item.id === "escapada" ? "¡Solo $7.20 por cita!" : "$12 por cita"}
                      </span>
                      <span className="pack-crypto-tag">o {cryptoMoney(item.cryptoPrice)}</span>
                      <small>{item.shippingLabel}</small>
                    </label>
                  ))}
                </div>
              </fieldset>

              <p className="pack-context" aria-live="polite"><Icon name={selected.hasFreeShipping ? "gift" : "truck"} />{bundleId === "popular" ? "Tu tercera bolsita es gratis. Ahorras $12 + Envío 100% GRATIS." : bundleId === "escapada" ? "Lleva 5 y paga solo 3. Envío VIP 100% GRATIS." : "Combo de 1 bolsita para probar. Envío NO incluido (flete cobro a destino)."}</p>
              <div className="purchase-actions" ref={purchaseRef}>
                <div className="dual-cta-group">
                  <button className="button-primary buy-button" onClick={openCheckout}>
                    <Icon name="bag" />
                    <span>Pedir ahora · {money(total)}{!selected.hasFreeShipping ? " + flete" : ""}</span>
                    <Icon name="arrow" />
                  </button>
                  <a
                    className="button-secondary-whatsapp"
                    href={`${SUPPORT}?text=${encodeURIComponent("Hola! Tengo una consulta sobre Spicy Cubbes antes de ordenar. ¿Me pueden asesorar?")}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icon name="message" />
                    <span>Preguntar por WhatsApp</span>
                  </a>
                </div>
                <div className="trust-badges-inline">
                  <span><Icon name="lock" /> Sobre ciego 100% sellado</span>
                  <span><Icon name="truck" /> Margarita 1h · Nacional 5 días</span>
                  <span><Icon name="check" /> Discreción absoluta garantizada</span>
                </div>
              </div>
              <div className="delivery-benefits"><span><Icon name="truck" />Envíos a toda Venezuela</span><span><Icon name="box" />Empaque sin logos</span></div>

              <div className="product-details">
                <details><summary>¿Qué viene en mi bolsita?<span>+</span></summary><p>Un par: exactamente dos cubos, uno para él y uno para ella. Cada bolsita está sellada de forma individual y corresponde a una cita.</p></details>
                <details><summary>Ingredientes y cuidados<span>+</span></summary><p>Sabor a durazno, capsaicina de ají y una fórmula natural con maca, muira puama y epimedium. Consulta el empaque para conocer la composición y las indicaciones.</p><p>Solo para mayores de 18 años. Si tomas medicamentos, tienes alguna condición de salud, estás en embarazo o lactancia, consulta a un profesional antes de consumir. El origen natural no elimina posibles contraindicaciones.</p></details>
              </div>
            </div>
          </div>
        </section>

        <div className="brand-promises page-width">
          <div><Icon name="leaf" /><p>Dulce de durazno.<span>Sabor suave y frutal.</span></p></div>
          <div><Icon name="pepper" /><p>Un toque picante.<span>El picantico que enciende la noche.</span></p></div>
          <div><Icon name="heart" /><p>Siempre de a dos.<span>Un cubito para cada uno.</span></p></div>
          <div><Icon name="box" /><p>Su pequeño secreto.<span>Discreto de principio a fin.</span></p></div>
        </div>

        {/* --- SECCION 01: AGITACION EMPATICA (ROMPE LA RUTINA) --- */}
        <section className="pain-points-section page-width">
          <div className="section-header">
            <span className="eyebrow">ROMPE LA RUTINA</span>
            <h2>¿A veces sienten que las noches<br /><em>se volvieron predecibles?</em></h2>
            <p className="section-subtitle">Pasa en las mejores relaciones. Entre el cansancio del trabajo, la casa y las pantallas, la chispa se va apagando sin darse cuenta.</p>
          </div>
          <div className="pain-points-grid">
            <div className="pain-card">
              <span className="pain-card-icon">😫</span>
              <h3>El cansancio de la semana</h3>
              <p>El trabajo, el tráfico, los pendientes diarios… Llegan a la cama con 1% de energía y lo único que provoca es dormir o mirar el techo.</p>
            </div>
            <div className="pain-card">
              <span className="pain-card-icon">📱</span>
              <h3>La desconexión en pareja</h3>
              <p>Cada quien revisando su teléfono o viendo una serie en automático. Falta ese juego previo y la complicidad que tenían al inicio.</p>
            </div>
            <div className="pain-card">
              <span className="pain-card-icon">🍬</span>
              <h3>La solución dulce y simple</h3>
              <p>Dos cubitos dulces de durazno con un toque de ají, 20 minutos antes, y la noche vuelve a ser de ustedes.</p>
            </div>
          </div>
        </section>

        <section className="ritual-section page-width" id="el-ritual">
          <div className="ritual-images">
            <div className="ritual-photo"><Image src={night} alt="Bolsitas individuales listas para acompañar una noche diferente" fill placeholder="blur" sizes="(max-width: 780px) 80vw, 400px" /></div>
            <div className="ritual-note"><Icon name="heart" /><span>la mejor parte<br />es compartir.</span><svg viewBox="0 0 150 22" aria-hidden="true"><path d="M3 15c39-10 81-16 142-9M11 20c37-8 76-11 114-9" /></svg></div>
            <span className="photo-credit">DATE NIGHT, A SU MANERA.</span>
          </div>
          <div className="ritual-text">
            <span className="eyebrow">NO HACE FALTA UNA OCASIÓN</span>
            <h2>Para un viernes.<br />O para <em>un martes.</em></h2>
            <p>No hace falta reservar una mesa ni inventar un gran plan. A veces, una bolsita para dos y tiempo juntos es justo lo que hacía falta.</p>
            <ol className="ritual-steps">
              <li><span>01</span><div><h3>Abran una bolsita.</h3><p>Un cubito para cada uno. Así de simple.</p></div></li>
              <li><span>02</span><div><h3>Pongan esa canción.</h3><p>La que siempre les saca una sonrisa.</p></div></li>
              <li><span>03</span><div><h3>Lo demás es de ustedes.</h3><p>Sin notificaciones. Sin mirar el reloj.</p></div></li>
            </ol>
            <button className="text-button" onClick={() => scrollToId("producto")}>Hoy invito yo <Icon name="arrow" /></button>
          </div>
        </section>

        <section className="community-section" id="comunidad">
          <div className="community-inner page-width">
            <div className="community-intro"><span className="eyebrow">DE NUESTRA COMUNIDAD</span><h2>Las buenas noches<br /><em>se recomiendan.</em></h2><span className="community-location">De Margarita, con picantico.</span></div>
            <div className="community-story" aria-live="polite">
              <span className="quote-mark" aria-hidden="true">“</span>
              <blockquote key={storyIndex}><p>{story.quote}</p><footer><strong>{story.name}</strong><span>{story.place}</span></footer></blockquote>
              <div className="story-controls"><span>{String(storyIndex + 1).padStart(2, "0")} <i>/</i> 03</span><div><button onClick={() => setStoryIndex((index) => (index - 1 + stories.length) % stories.length)} aria-label="Testimonio anterior"><Icon name="arrow" className="rotate-arrow" /></button><button onClick={() => setStoryIndex((index) => (index + 1) % stories.length)} aria-label="Siguiente testimonio"><Icon name="arrow" /></button></div></div>
            </div>
          </div>
        </section>

        <section className="faq-section page-width" id="preguntas">
          <div className="faq-intro">
            <span className="eyebrow">LAS COSAS CLARAS</span>
            <h2>Así llega<br /><em>tu pedido.</em></h2>
            
            <div className="parcel-preview-box">
              <div className="parcel-preview-image">
                <Image src={deliveryNight} alt="Entregas reales en mano de Spicy Cubbes en la noche" placeholder="blur" sizes="320px" className="object-cover rounded-md" />
                <span className="delivery-photo-tag">📸 Entregas reales · Foto cliente</span>
              </div>
              <p className="parcel-preview-desc">
                🍬 <b>Cero sospechas:</b> A simple vista parecen unas gomitas dulces normales. Recibes tus bolsitas herméticas individuales con los dos cubitos listos para llevar contigo sin llamar la atención de nadie.
              </p>
            </div>

            <a href={SUPPORT} target="_blank" rel="noreferrer" className="text-button" style={{ marginTop: "14px" }}>
              ¿Otra duda? Hablemos <Icon name="arrow" />
            </a>
          </div>
          <div className="faq-questions">{questions.map((item, index) => <details key={item.question}><summary><span className="question-number">0{index + 1}</span><span>{item.question}</span><span className="question-plus">+</span></summary><p>{item.answer}</p></details>)}</div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-width">
          <div className="footer-top"><div><span className="eyebrow">NOS GUSTA HABLAR CONTIGO</span><a className="footer-contact" href={SUPPORT} target="_blank" rel="noreferrer">¿Hablamos? <Icon name="arrow" /></a><span className="footer-phone">+58 422 720 1945</span></div><div className="footer-links"><a href={CHANNEL} target="_blank" rel="noreferrer">Nuestro canal de WhatsApp <Icon name="arrow" /></a><button onClick={() => setPolicy("shipping")}>Entregas y pagos</button><button onClick={() => setPolicy("privacy")}>Privacidad</button></div><div className="footer-signoff"><Icon name="heart" /><span>Un par.<br /><em>Un plan.</em></span></div></div>
          <div className="footer-wordmark"><Wordmark large /></div>
          <div className="footer-bottom"><p>© {new Date().getFullYear()} Spicy Cubes Venezuela.</p><span>Solo para mayores de 18 años. Disfruta con responsabilidad.</span><span>Hecho para compartir, no para la rutina.</span></div>
        </div>
      </footer>

      <div className={`sticky-purchase ${showSticky && !checkoutOpen && !zoomOpen && !policy ? "is-visible" : ""}`} aria-hidden={!showSticky || checkoutOpen || zoomOpen || !!policy}>
        <div className="page-width"><div className="sticky-product"><Image src={pouch} alt="" width={48} height={48} sizes="48px" /><div><strong>Spicy Cubbes</strong><span>{bagLabel(selected.quantity)} · {selected.shippingLabel}</span></div></div><button className="button-primary" onClick={openCheckout} tabIndex={showSticky && !checkoutOpen && !zoomOpen && !policy ? 0 : -1}>Pedir · {money(total)} <Icon name="arrow" /></button></div>
      </div>

      <dialog ref={checkoutRef} className="checkout-dialog" aria-labelledby="checkout-title" onClose={() => setCheckoutOpen(false)} onCancel={(event) => { event.preventDefault(); setCheckoutOpen(false); }} onClick={(event) => { if (event.target === event.currentTarget) setCheckoutOpen(false); }}>
        <div className="checkout-panel">
          <div className="checkout-header"><span><Icon name="bag" /> Tu Pedido</span><button className="icon-button" onClick={() => setCheckoutOpen(false)} aria-label="Cerrar pedido"><Icon name="close" /></button></div>
          {receipt ? <div className="checkout-success" role="status">
            <span className="success-check"><Icon name="check" /></span>
            <span className="eyebrow">PEDIDO #{receipt.id} REGISTRADO</span>
            <h2 id="checkout-title">¡Todo listo para coordinar!</h2>
            <p>
              Hemos registrado tu pedido de <b>{receiptBundle?.quantity ? bagLabel(receiptBundle.quantity) : "Spicy Cubbes"}</b>. Te escribiremos de inmediato a tu WhatsApp para coordinar los detalles de despacho con total discreción.
            </p>

            <div className="receipt-total">
              <div>
                <span>Total:</span>
                <strong>{money(receipt.total)}</strong>
              </div>
              <div style={{ marginTop: "4px" }}>
                <span>{showExpressPay ? "⚡ Pago Express Prioritario" : "💬 Coordinar por WhatsApp"}</span>
              </div>
            </div>

            <a
              className="button-primary"
              href={`${SUPPORT}?text=${encodeURIComponent(
                showExpressPay
                  ? `Hola! Acabo de registrar mi pedido #${receipt.id} en la web con Pago Express. Combo: ${bagLabel(receiptBundle?.quantity ?? 3)} (${money(receipt.total)}). Nombre: ${form.fullName}. ${form.paymentReference ? `Referencia: ${form.paymentReference}. ` : ""}Adjunto mi comprobante para despachar.`
                  : `Hola! Acabo de registrar mi pedido #${receipt.id} en la web. Combo: ${bagLabel(receiptBundle?.quantity ?? 3)} (${money(receipt.total)}). Nombre: ${form.fullName}. Por favor indíquenme cómo coordinar el despacho y pago.`
              )}`}
              target="_blank"
              rel="noreferrer"
              style={{ marginTop: "16px" }}
            >
              Abrir WhatsApp ahora <Icon name="arrow" />
            </a>
            <button className="text-button" onClick={() => { setReceipt(null); setCheckoutOpen(false); }}>Volver a la tienda <Icon name="arrow" /></button>
          </div> : <>
            <div className="checkout-heading">
              <span className="eyebrow">PEDIDO RÁPIDO</span>
              <h2 id="checkout-title">Solo 2 datos para pedir</h2>
              <p>Te llamamos para confirmar tu pedido. <b>No pagas nada ahora.</b></p>
            </div>
            <form onSubmit={submitOrder} className="checkout-form">
              <fieldset disabled={loading}>
                <div className="checkout-product"><Image src={pouch} alt="Bolsita individual Spicy Cubbes" width={75} height={90} sizes="75px" /><div><strong>Spicy Cubbes</strong><span>Durazno dulce con toque de ají</span><label className="sr-only" htmlFor="checkout-pack">Pack seleccionado</label><select id="checkout-pack" value={bundleId} onChange={(event) => selectBundle(event.target.value as BundleId)}>{PRODUCT_BUNDLES.map((item) => <option value={item.id} key={item.id}>{bagLabel(item.quantity)} — {money(item.price)}{item.hasFreeShipping ? " · Envío GRATIS" : " · Flete a destino"}</option>)}</select></div></div>
                <div className="checkout-totals">
                  <div><span>{bagLabel(selected.quantity)}</span><span>{money(selected.price)}</span></div>
                  <div><span>Envío{selected.id === "escapada" ? " VIP" : ""}</span><span className={selected.hasFreeShipping ? "free-shipping" : ""}>{selected.hasFreeShipping ? "100% GRATIS" : "Cobro a destino"}</span></div>
                  <div className="total-line"><strong>Total a pagar</strong><strong>{money(total)} <small>USD</small></strong></div>
                  <div className="crypto-checkout-note">
                    <span>💵 O paga <strong>{cryptoMoney(cryptoTotal)}</strong> (15% OFF en Binance USDT)</span>
                  </div>
                </div>

                {/* --- AVISO REASEGURO TELEFÓNICO --- */}
                <div className="call-reassurance-box">
                  <Icon name="message" />
                  <span>📞 <b>Te llamamos para confirmar:</b> No tienes que pagar nada ahora.</span>
                </div>

                <div className="checkout-fields" style={{ marginTop: "12px" }}>
                  <label className="field field-wide"><span>Tu Nombre y Apellido:</span><input name="fullName" required maxLength={120} autoComplete="name" placeholder="¿A nombre de quién?" value={form.fullName} onChange={(event) => updateField("fullName", event.target.value)} /></label>
                  <label className="field field-wide"><span>Tu WhatsApp (para llamarte y coordinar):</span><input name="phone" type="tel" required minLength={7} maxLength={32} autoComplete="tel" placeholder="0412 1234567" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} /></label>
                </div>

                {/* --- BOTON DESPLEGABLE PAGO EXPRESS --- */}
                <div className="express-pay-toggle-box">
                  <button
                    type="button"
                    className={`express-toggle-btn ${showExpressPay ? "active" : ""}`}
                    onClick={() => setShowExpressPay(!showExpressPay)}
                  >
                    <span>⚡ ¿Deseas hacer Pago Express de una vez?</span>
                    <b>{showExpressPay ? "Ocultar ▲" : "Ver datos de pago ▼"}</b>
                  </button>

                  {showExpressPay && (
                    <div className="express-pay-content">
                      <p className="express-note">Transfiere ahora y pega tu referencia para despacho express prioritario:</p>
                      <div className="pay-now-grid">
                        <div className="pay-box">
                          <strong>📱 Pago Móvil Mercantil</strong>
                          <p>Banco: <b>Mercantil (0105)</b></p>
                          <p>Teléfono: <b>0424 8261957</b></p>
                          <p>C.I.: <b>31.455.753</b></p>
                          <small>Monto: Equivalente a {money(total)}</small>
                        </div>
                        <div className="pay-box">
                          <strong>💰 Binance USDT (15% OFF)</strong>
                          <p>Pay ID: <b>1023279087</b></p>
                          <p>Correo: <b>davidg.050906@gmail.com</b></p>
                          <small>Monto: <b>{cryptoMoney(cryptoTotal)}</b></small>
                        </div>
                      </div>
                      <label className="field field-wide" style={{ marginTop: "10px" }}>
                        <span>Pega aquí tu número de Referencia bancaria (Opcional):</span>
                        <input
                          placeholder="Ej. Ref #849204 o Hash Binance"
                          value={form.paymentReference}
                          onChange={(e) => updateField("paymentReference", e.target.value)}
                        />
                      </label>
                    </div>
                  )}
                </div>

                {error && <div className="form-error" role="alert">{error} <a href={SUPPORT} target="_blank" rel="noreferrer">Te ayudamos por WhatsApp.</a></div>}

                <button type="submit" className="button-primary checkout-submit" disabled={loading} style={{ marginTop: "16px" }}>
                  {loading
                    ? "Procesando pedido…"
                    : showExpressPay
                    ? `⚡ Enviar Comprobante por WhatsApp · ${money(total)}`
                    : `💬 Pedir · Te llamamos para confirmar (${money(total)})`}
                  <Icon name={loading ? "heart" : "arrow"} />
                </button>

                {!showExpressPay && (
                  <p className="reassurance-subtext">
                    📞 <b>Te llamamos para confirmar tu pedido.</b> No pagas nada ahora.
                  </p>
                )}

                <p className="checkout-confidential"><Icon name="lock" /> Sobre 100% sellado y ciego. Nadie sabe qué compraste.</p>
              </fieldset>
            </form>
          </>}
        </div>
      </dialog>

      <dialog ref={zoomRef} className="zoom-dialog" aria-label="Galería ampliada de Spicy Cubes" onClose={() => setZoomOpen(false)} onCancel={(event) => { event.preventDefault(); setZoomOpen(false); }} onKeyDown={(event) => { if (event.key === "ArrowRight") changePhoto(1); if (event.key === "ArrowLeft") changePhoto(-1); }}>
        <div className="zoom-inner"><button className="icon-button zoom-close" onClick={() => setZoomOpen(false)} aria-label="Cerrar galería"><Icon name="close" /></button><div className="zoom-image"><Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 780px) 92vw, 850px" quality={75} /></div><div className="zoom-controls"><button className="icon-button" onClick={() => changePhoto(-1)} aria-label="Fotografía anterior"><Icon name="arrow" className="rotate-arrow" /></button><span>{photo.label} · {photoIndex + 1} / {photos.length}</span><button className="icon-button" onClick={() => changePhoto(1)} aria-label="Fotografía siguiente"><Icon name="arrow" /></button></div></div>
      </dialog>

      <dialog ref={policyRef} className="policy-dialog" aria-labelledby="policy-title" onClose={() => setPolicy(null)} onCancel={(event) => { event.preventDefault(); setPolicy(null); }} onClick={(event) => { if (event.target === event.currentTarget) setPolicy(null); }}>
        <div className="policy-content"><button className="icon-button policy-close" onClick={() => setPolicy(null)} aria-label="Cerrar información"><Icon name="close" /></button><span className="eyebrow">SPICY CUBBES VENEZUELA</span><h2 id="policy-title">{policy === "privacy" ? "Tu privacidad importa." : "Entregas y pagos."}</h2>{policy === "privacy" ? <><p>Recogemos tu nombre, WhatsApp, ubicación, dirección y, si la añades, una nota de entrega. Los utilizamos para registrar, confirmar y coordinar tu pedido.</p><p>Los datos se almacenan en nuestra base de pedidos. Si los servicios de gestión y notificación están configurados, el equipo puede recibir los datos a través de esas herramientas para atenderte.</p><p>Si el píxel de Meta está configurado, se registran eventos de navegación y solicitud de pedido. No se envían a ese píxel los campos de tu formulario desde esta página.</p><p>Puedes solicitar la consulta, corrección o eliminación de tus datos contactándonos por WhatsApp.</p></> : <><p>Despachamos pedidos Express en Margarita en aprox. 1 hora (horario laboral) y coordinamos envíos nacionales por agencias Zoom y MRW en 5 días hábiles.</p><p>El combo de una bolsita cuesta $12 con flete cobro a destino. Los packs de tres ($24) y cinco ($36) incluyen envío 100% gratis a toda Venezuela.</p><p>Pagas de forma segura vía Pago Móvil Mercantil o en Binance USDT con un 15% de descuento especial. Todos los pedidos salen en sobre o caja exterior neutra, sellada y totalmente ciega.</p></>}<a className="text-button" href={SUPPORT} target="_blank" rel="noreferrer">Hablar con nosotros <Icon name="arrow" /></a></div>
      </dialog>
    </>
  );
}
