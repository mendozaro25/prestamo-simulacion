import { ReactNode } from "react";
import "./styles/globals.css";

export const metadata = {
  title: "Simulador de Préstamo Personal | JLuu",
  description: "Simulador de Préstamo Personal",
  keywords: [
    "Simulador de Préstamo Personal",
    "Simulador de Gratificación y CTS",
    "Simulador de RH",
    "Simulador de Prestamo",
    "Simulador de Préstamo",
    "Gratificación",
    "CTS",
    "RH",
    "Prestamo",
    "Préstamo",
  ],
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    title: "Simulador de Préstamo Personal",
    statusBarStyle: "light",
    themeColor: "#000000",
    backgroundColor: "#ffffff",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
