# Spicy Cubbes Venezuela — Landing Page

Landing page oficial de alta conversión para **Spicy Cubbes** en Venezuela.

## Stack Tecnológico
- **Framework:** Next.js 16 (App Router)
- **Estilos:** Tailwind CSS 4
- **Optimización:** Mobile-First UX/UI, SEO y Web Vitals
- **Analítica:** Integración nativa con Meta Pixel (Facebook & Instagram Ads)

## Despliegue en Cloudflare Pages
1. Conecta tu repositorio de GitHub en el panel de **Cloudflare Pages**.
2. Configuración de Build:
   - **Framework Preset:** Next.js
   - **Build command:** `npx @cloudflare/next-on-pages` (o `npm run build`)
   - **Build output directory:** `.vercel/output/static` (o `.next` según el preset)
3. Variables de entorno (Opcional):
   - `NEXT_PUBLIC_META_PIXEL_ID`: ID del píxel de Meta para telemetría publicitaria.

## Desarrollo Local
```bash
npm install
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador.
