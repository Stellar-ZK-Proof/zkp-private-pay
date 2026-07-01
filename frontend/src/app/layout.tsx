import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "ZKP Private Pay — Stellar",
  description: "Zero-knowledge proof private institutional payments on Stellar",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
