import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Spicy Cubbes Venezuela — Un poquito dulce. Un poquito spicy.",
  description: "Gomitas de durazno con un toque de ají, hechas para compartir. 1 bolsita, 2 cubos, 1 cita. Envíos discretos y pago al recibir en Venezuela.",
  applicationName: "Spicy Cubbes Venezuela",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Spicy Cubbes — Un par. Un plan.",
    description: "Dos cubitos para compartir. Envío discreto y pago al recibir en Venezuela.",
    locale: "es_VE",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const pixelId = "2045055106181681";

  return (
    <html lang="es-VE">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');`,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
