import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";

const bodyFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "QuickWash",
  description: "Mobile-first car wash marketplace prototype.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body 
        className={`${bodyFont.variable} antialiased`} 
        style={{ 
          background: "#e5e5ea", 
          display: "flex", 
          justifyContent: "center",
          margin: 0,
          minHeight: "100vh"
        }}
      >
        <div 
          style={{ 
            width: "100%", 
            maxWidth: 480, 
            minHeight: "100vh", 
            background: "#ffffff", 
            position: "relative", 
            boxShadow: "0 0 40px rgba(0,0,0,0.08)", 
            overflowX: "hidden",
            display: "flex",
            flexDirection: "column"
          }}
        >
          {children}
        </div>
      </body>
    </html>
  );
}
