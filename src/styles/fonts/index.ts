import { Oswald } from "next/font/google";

const integralCF = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  fallback: ["sans-serif"],
  variable: "--font-integralCF",
});

const satoshi = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  fallback: ["sans-serif"],
  variable: "--font-satoshi",
});

export { integralCF, satoshi };
