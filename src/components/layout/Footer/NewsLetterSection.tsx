import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import Image from "next/image";
import Link from "next/link";

const contactItems = [
  {
    id: 1,
    href: "tel:+381600000000",
    icon: "/images/phone.svg",
    label: "Pozovite nas",
  },
  {
    id: 2,
    href: "https://wa.me/381600000000",
    icon: "/images/wa.svg",
    label: "Pišite nam na WhatsApp",
  },
  {
    id: 3,
    href: "viber://chat?number=%2B381600000000",
    icon: "/images/viber.svg",
    label: "Pišite nam na Viber",
  },
];

const NewsLetterSection = () => {
  return (
    <div className="relative overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-4 py-9 md:py-11 px-6 md:px-16 max-w-frame mx-auto bg-brand rounded-[20px]">
      <div className="absolute inset-0 opacity-75 pointer-events-none">
        <Image
          src="/images/hijeroglofi.svg"
          alt=""
          fill
          className="object-cover scale-150" // Povećava sliku za 50% (zumira je)
          aria-hidden="true"
        />
      </div>

      <p
        className={cn([
          integralCF.className,
          "relative z-10 font-bold text-2xl md:text-4xl text-white mb-0 text-center md:text-left",
        ])}
      >
        KONTAKTIRAJTE NAS! <br />
        TU SMO ZA SVA VAŠA PITANJA!
      </p>

      <div className="relative z-10 flex items-center md:justify-end">
        <div className="flex items-center gap-3 md:gap-6 w-full justify-center md:justify-end">
          {contactItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              aria-label={item.label}
              className="relative rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-white/10 ring-1 ring-white/20 shadow-[0_10px_22px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(0,0,0,0.4)] transition-all"
            >
              <Image
                src={item.icon}
                fill={true}
                alt={item.label}
                className="w-6 h-6 md:w-8 md:h-8"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsLetterSection;
