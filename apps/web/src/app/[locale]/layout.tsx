import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "../globals.css";
import { Web3Provider } from "@/providers/Web3Provider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-dm-sans",
});

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "KUMPLY — On-Chain Compliance for the Avalanche® Blockchain",
    template: "%s | KUMPLY",
  },
  description: "The complete compliance toolkit for the Avalanche® blockchain. KYC for people, KYB for companies, KYA for AI agents — verify once, access everywhere via Interchain Messaging (ICM). Non-custodial. Software-only. No PII stored.",
  keywords: ["KYC", "KYB", "KYA", "compliance", "Avalanche", "DeFi", "blockchain", "identity", "LatAm", "eERC", "Interchain Messaging", "ICM", "Fuji", "non-custodial", "on-chain", "Avalanche L1", "AI agent compliance"],
  metadataBase: new URL("https://kumply.xyz"),
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  alternates: {
    canonical: "/",
    languages: {
      en: "/en",
      es: "/es",
    },
  },
  openGraph: {
    title: "On-Chain Compliance for the Avalanche® Blockchain",
    description: "Verify once, access everywhere. KYC, KYB, and KYA compliance credentials via encrypted tokens and Interchain Messaging (ICM) on the Avalanche® blockchain. Non-custodial, software-only, no PII stored.",
    type: "website",
    locale: "en_US",
    alternateLocale: "es_MX",
    siteName: "KUMPLY",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "KUMPLY — Compliance Infrastructure for the Avalanche® Public Blockchain",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "On-Chain Compliance for the Avalanche® Blockchain",
    description: "Verify once, access everywhere. KYC, KYB, and KYA compliance credentials via encrypted tokens and Interchain Messaging (ICM) on the Avalanche® blockchain. Non-custodial, software-only, no PII stored.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}>) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "KUMPLY Protocol",
    applicationCategory: "BlockchainApplication",
    operatingSystem: "Web",
    description: "The complete compliance toolkit for the Avalanche® blockchain. KYC for people, KYB for companies, KYA for AI agents — via encrypted credentials and Interchain Messaging (ICM).",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <html lang={locale} dir="ltr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.avax.network" />
        <link rel="preconnect" href="https://api.avax-test.network" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={dmSans.className}>
        <a href="#main-content" className="skip-link" style={{
          position: 'absolute', left: '-9999px', top: '0', zIndex: 9999,
          padding: '1rem', background: 'var(--accent)', color: '#fff', fontWeight: 700,
        }}>Skip to main content</a>
        <NextIntlClientProvider messages={messages}>
          <Web3Provider>
            <Navbar />
            <main id="main-content" className="page" role="main">
              {children}
            </main>
            <Footer />
          </Web3Provider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
