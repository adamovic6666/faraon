import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { satoshi } from "@/styles/fonts";
import TopNavbar from "@/components/layout/Navbar/TopNavbar";
import Footer from "@/components/layout/Footer";
import HolyLoader from "holy-loader";
import Providers from "./providers";
import HeroNavBar from "@/components/homepage/Header/HeroNavBar";
import CookieConsent from "@/components/common/CookieConsent";
import { fetchTopLevelCategories } from "@/lib/api/faraon";
import GoogleAnalytics from "./_components/google-analytics/GoogleAnalytics";

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://faraondiskonti.rs";

const defaultTitle =
  "Faraon diskonti | Online prodavnica pića i dostava na adresu";
const defaultDescription =
  "Sve što pijete, Faraon donosi! Poručite pića online i uživajte u besplatnoj dostavi za porudžbine preko 12.000 RSD. Pivo, vino, žestoka pića i bezalkoholna pića.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: "%s | Faraon diskonti",
    default: defaultTitle,
  },
  description: defaultDescription,
  icons: {
    icon: "/images/favicon.webp",
  },
  verification: {
    google: "NV6vQB2yVDNPVwvxudSfvJp5Z0krUExyWp7px-K5jO4",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Faraon diskonti",
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: "/images/og.webp",
        width: 1200,
        height: 630,
        alt: "Faraon diskonti",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/images/og.webp"],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await fetchTopLevelCategories();

  return (
    <html lang="en">
      <body className={satoshi.className} suppressHydrationWarning>
        <HolyLoader color="#868686" />
        <Providers>
          <TopNavbar categories={categories} />
          <HeroNavBar categories={categories} />
          <div className="pt-16">{children}</div>
          <Footer />
          <CookieConsent />
          <GoogleAnalytics />
        </Providers>
      </body>
    </html>
  );
}
