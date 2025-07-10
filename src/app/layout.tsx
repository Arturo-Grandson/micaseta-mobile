import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";

// Definir la fuente Inter
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MiCaseta",
  description: "Aplicación para gestionar tu caseta",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${fontSans.variable}`}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </head>
      <body className="font-sans antialiased bg-gray-100">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
