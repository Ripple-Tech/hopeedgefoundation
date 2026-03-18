import type { Metadata } from "next";
import { Oswald, Open_Sans, Montserrat } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import InstallPrompt from "@/components/InstallPrompt";

// Display font for headings — matches the NGO brand
const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

// Body / paragraph font
const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
  weight: ["300", "400", "600"],
});

// Sub-heading / accent font
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Rigar KariyaFoundation | Empowering Communities Worldwide",
  description:
    "Rigar KariyaFoundation works across 40+ countries to provide education, combat gender violence, and build resilient communities — one family at a time.",

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },

  openGraph: {
    title: "Rigar KariyaFoundation",
    description:
      "Empowering communities through education, safety, and opportunity — across 40+ countries.",
    url: "https://hopeedgefoundation.vercel.app",
    siteName: "Rigar KariyaFoundation",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Rigar KariyaFoundation",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Rigar KariyaFoundation",
    description:
      "Empowering communities through education, safety, and opportunity worldwide.",
    images: ["/logo.png"],
  },

  manifest: "/site.webmanifest",

  keywords: [
    "NGO",
    "non-profit",
    "community empowerment",
    "education",
    "gender violence",
    "humanitarian",
    "volunteer",
    "Rigar KariyaFoundation",
    "global charity",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        oswald.variable,
        openSans.variable,
        montserrat.variable,
        "scroll-smooth"
      )}
    >
      <body
        className={cn(
          "min-h-screen flex flex-col antialiased",
          "bg-[#13111e] text-[#d7cfff]",
          "font-[family-name:var(--font-open-sans)]",
          "selection:bg-[#58d98c] selection:text-[#13111e]"
        )}
      >
        <main className="grow relative min-h-screen overflow-hidden">
          {/* Centered website container */}
          <div className="max-w-[1440px] mx-auto w-full">
            {children}
          </div>
          <InstallPrompt />
        </main>
      </body>
    </html>
  );
}