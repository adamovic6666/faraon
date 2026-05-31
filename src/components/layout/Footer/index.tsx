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
    srcUrl: "/icons/dina-card.png",
  },
  {
    id: 2,
    srcUrl: "/icons/visa-blue.png",
  },
  {
    id: 3,
    srcUrl: "/icons/mc.png",
  },
  {
    id: 4,
    srcUrl: "/icons/visa-secure.png",
  },
  {
    id: 5,
    srcUrl: "/icons/mc-id.png",
  },
  {
    id: 6,
    srcUrl: "/icons/uni.jpg",
    href: "https://www.unicreditbank.rs",
  },
];

const socialLinks = [
  {
    id: 1,
    href: "https://www.facebook.com/diskonti.faraon/?locale=sr_RS",
    icon: "/images/facebook.svg",
    label: "Facebook",
  },
  {
    id: 2,
    href: "https://www.instagram.com/diskonti.faraon/",
    icon: "/images/instagram.svg",
    label: "Instagram",
  },
];

const contactLinks = [
  {
    id: 1,
    label: "T: 060 22 33 400",
    href: "tel:+381602233400",
  },
  {
    id: 2,
    label: "E: info@faraondiskonti.rs",
    href: "mailto:info@faraondiskonti.rs",
  },
];

const infoLinks = [
  { label: "Opšti uslovi", href: "/opsti-uslovi" },
  { label: "Uslovi plaćanja", href: "/uslovi-placanja" },
  { label: "Cenovnik dostave", href: "/cenovnik-dostave" },
  { label: "Isporuka i reklamacije", href: "/isporuka-i-reklamacije" },
  { label: "Politika privatnosti", href: "/politika-privatnosti" },
  { label: "Obaveštenje o kolačićima", href: "/obavestenje-o-kolacicima" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="relative">
        <div className="absolute bottom-0 w-full h-1/2 bg-section" />
        <div className="px-4">
          <NewsLetterSection />
        </div>
      </div>

      <div className="bg-section px-4 pb-4 pt-8 md:pt-12">
        <div className="max-w-frame mx-auto">
          <nav className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-[1.05fr_1fr_1.15fr] md:gap-10 lg:gap-16">
            <section className="relative flex h-full flex-col">
              <div className="mb-5 flex items-center gap-4">
                <h2
                  className={cn([
                    integralCF.className,
                    "text-brand text-xl font-semibold uppercase sm:text-2xl",
                  ])}
                >
                  FARAON DISKONTI
                </h2>
              </div>

              <div className="mb-6 flex items-center gap-3">
                {socialLinks.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    aria-label={item.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-transform hover:-translate-y-0.5"
                  >
                    <Image
                      src={item.icon}
                      alt={item.label}
                      width={32}
                      height={32}
                    />
                  </Link>
                ))}
              </div>

              <div className="relative overflow-hidden rounded-xl border border-black/15 bg-white p-2 max-w-34 gap-2 flex items-center justify-center flex-col">
                <Image
                  src="/images/18+.webp"
                  alt="18 plus"
                  width={112}
                  height={112}
                  sizes="112px"
                />
                <p className="text-xs font-light text-center">
                  Zabranjena prodaja i služenje maloletnim osobama. <br />
                  Prekomerno konzumiranje alkoholnih pića dovodi do ozbiljnih
                  zdravstvenih rizika.
                </p>
              </div>
            </section>

            <section id="kontakt">
              <div className="mb-5 flex items-center gap-4">
                <h3
                  className={cn([
                    integralCF.className,
                    "text-black text-xl font-semibold sm:text-2xl",
                  ])}
                >
                  Kontakt
                </h3>
              </div>
              <address className="not-italic text-md font-light leading-7 text-black/80">
                <p>STR Diskont pića Faraon PS</p>
                <p>Karlovački put 1</p>
                <p>21132 Petrovaradin</p>
                <div className="flex flex-col">
                  {contactLinks.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="w-fit hover:underline"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
                <p className="">PIB: 104032720</p>
              </address>
            </section>

            <section>
              <div className="mb-5 flex items-center gap-4">
                <h3
                  className={cn([
                    integralCF.className,
                    "text-black text-xl font-semibold sm:text-2xl",
                  ])}
                >
                  Informacije
                </h3>
              </div>
              <ul className="text-md font-light leading-7 text-black/80">
                {infoLinks.map((item) => (
                  <li
                    key={item.href}
                    className="w-fit transition-colors hover:text-brand"
                  >
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </section>
          </nav>

          <Separator className="mb-6 bg-black/10" />

          <div className="flex flex-col sm:flex-row justify-center md:justify-between items-center gap-4 mb-2">
            <p className="text-sm text-black/70 text-center sm:text-left font-light">
              © {currentYear} STR Diskont Pića Faraon PS
            </p>

            <div className="flex flex-wrap justify-center items-center gap-2 max-w-52 sm:max-w-none">
              {paymentBadgesData.map((badge) => {
                const inner = (
                  <Image
                    priority
                    src={badge.srcUrl}
                    width={48}
                    height={48}
                    alt="Payment method"
                    className="max-h-7 max-w-full object-contain"
                  />
                );
                const cls =
                  "w-14 h-9 rounded-[5px] border-[#D6DCE5] bg-white flex items-center justify-center overflow-hidden p-1";
                return badge.href ? (
                  <Link
                    key={badge.id}
                    href={badge.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cls}
                  >
                    {inner}
                  </Link>
                ) : (
                  <span key={badge.id} className={cls}>
                    {inner}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
        <LayoutSpacing />
      </div>
    </footer>
  );
};

export default Footer;
