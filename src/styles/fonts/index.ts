import { Oswald } from "next/font/google";

const integralCF = Oswald({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  fallback: ["sans-serif"],
  variable: "--font-integralCF",
});

const satoshi = Oswald({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  fallback: ["sans-serif"],
  variable: "--font-satoshi",
});

const oswaldLight = Oswald({
  subsets: ["latin"],
  weight: ["300"],
  fallback: ["sans-serif"],
  variable: "--font-oswald-light",
});

export { integralCF, satoshi, oswaldLight };
