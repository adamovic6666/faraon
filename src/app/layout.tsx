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

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://faraon.rs",
  ),
  title: {
    template: "%s | Faraon diskonti",
    default: "Faraon diskonti",
  },
  description:
    "Sve što pijete, Faraon donosi! Besplatna dostava za porudžbine preko 12,000 RSD!",
  icons: {
    icon: "/images/favicon.webp",
  },
  openGraph: {
    title: "Faraon diskonti",
    description:
      "Sve što pijete, Faraon donosi! Besplatna dostava za porudžbine preko 12,000 RSD!",
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
          <TopNavbar />
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
