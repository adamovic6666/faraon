import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import { PaymentBadge } from "./footer.types";
import Link from "next/link";
import Image from "next/image";
import NewsLetterSection from "./NewsLetterSection";
import LayoutSpacing from "./LayoutSpacing";
import { Separator } from "@/components/ui/separator";

const paymentBadgesData: PaymentBadge[] = [
  {
    id: 1,
    srcUrl: "/icons/Visa.svg",
  },
  {
    id: 2,
    srcUrl: "/icons/mastercard.svg",
  },
  {
    id: 3,
    srcUrl: "/icons/paypal.svg",
  },
  {
    id: 4,
    srcUrl: "/icons/applePay.svg",
  },
  {
    id: 5,
    srcUrl: "/icons/googlePay.svg",
  },
];

const socialLinks = [
  {
    id: 1,
    href: "https://facebook.com",
    icon: "/images/facebook.svg",
    label: "Facebook",
  },
  {
    id: 2,
    href: "https://instagram.com",
    icon: "/images/Instagram.svg",
    label: "Instagram",
  },
];

const privacyLinks = [
  "Cenovnik dostave",
  "Pravila korišćenja",
  "Isporuka i načini plaćanja",
  "Zamene, reklamacije i otkazivanje",
  "Autorska prava",
  "Zaštita podataka o ličnosti",
  "Uslovi korišćenja platnih kartica",
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-10">
      <div className="relative">
        <div className="absolute bottom-0 w-full h-1/2 bg-section" />
        <div className="px-4">
          <NewsLetterSection />
        </div>
      </div>

      <div className="pt-8 md:pt-12 bg-section px-4 pb-4">
        <div className="max-w-frame mx-auto">
          <nav className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 mb-10">
            <section className="flex flex-col">
              <h2
                className={cn([
                  integralCF.className,
                  "text-brand text-3xl mb-4 font-semibold",
                ])}
              >
                FARAON
              </h2>
              <p className="text-black/80 text-md md:text-xl leading-relaxed mb-3 md:mb-6">
                Sve što pijete,
                <br />
                Faraon donosi!
              </p>
              <div className="flex items-center gap-3">
                {socialLinks.map((item) => (
                  <Link key={item.id} href={item.href} aria-label={item.label}>
                    <Image
                      src={item.icon}
                      alt={item.label}
                      width={32}
                      height={32}
                    />
                  </Link>
                ))}
              </div>
            </section>

            <section>
              <h3
                className={cn([
                  integralCF.className,
                  "text-black text-2xl mb-4 uppercase",
                ])}
              >
                Kontakt
              </h3>
              <address className="not-italic text-black/80 text-md md:text-xl leading-9">
                STR Diskont pića Faraon PS
                <br />
                Karlovački put 1
                <br />
                21132 Petrovaradin
                <br />
                T:{" "}
                <Link href="tel:+381214433324" className="hover:underline">
                  021 433 324
                </Link>
                <br />
                F:{" "}
                <Link href="tel:+381216433324" className="hover:underline">
                  021 6433 324
                </Link>
                <br />
                E:{" "}
                <Link
                  href="mailto:info@faraondiskonti.rs"
                  className="hover:underline"
                >
                  info@faraondiskonti.rs
                </Link>
                <br />
                PIB: 104032720
              </address>
            </section>

            <section>
              <h3
                className={cn([
                  integralCF.className,
                  "text-black text-2xl mb-4 uppercase",
                ])}
              >
                Politika privatnosti
              </h3>
              <ul className="text-black/80 text-md md:text-xl leading-9">
                {privacyLinks.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </nav>

          <Separator className="mb-6 bg-black/10" />

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-2">
            <p className="text-sm text-black/70 text-center sm:text-left">
              © {currentYear} STR Diskont Pića Faraon PS
            </p>

            <div className="flex items-center">
              {paymentBadgesData.map((badge, _, arr) => (
                <span
                  key={badge.id}
                  className={cn([
                    arr.length !== badge.id && "mr-3",
                    "w-11.5 h-7.5 rounded-[5px] border-[#D6DCE5] bg-white flex items-center justify-center",
                  ])}
                >
                  <Image
                    priority
                    src={badge.srcUrl}
                    width={33}
                    height={100}
                    alt="Payment method"
                    className="max-h-3.75"
                  />
                </span>
              ))}
            </div>
          </div>
        </div>
        <LayoutSpacing />
      </div>
    </footer>
  );
};

export default Footer;
