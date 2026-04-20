import SectionTitle from "@/components/common/SectionTitle";
import StoreMapSection from "@/components/homepage/StoreMapSection";
import * as motion from "framer-motion/client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diskont pića u tvom komšiluku",
  description:
    "Gde god da si u Novom Sadu, Faraon je blizu tebe. Pronađi najbliži diskont pića na mapi i svrati po osveženje po najpovoljnijim cenama.",
};

const LokacijePage = () => {
  return (
    <div className="relative pt-20 pb-10 md:pt-24 md:pb-12">
      <div className="max-w-frame mx-auto px-4 xl:px-0 flex flex-col items-center text-center">
        <SectionTitle title="FARAON U TVOM KRAJU!" />
        <motion.p
          initial={{ y: "60px", opacity: 0 }}
          whileInView={{ y: "0", opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-black/80 text-md sm:text-lg leading-relaxed pt-2 font-light max-w-160"
        >
          Sigurno smo blizu tebe – sa mrežom od 23 diskonta, obezbedili smo
          najbolju ponudu i cene pića u svakom delu Novog Sada. Pogledaj mapu
          ispod i pronađi najkraći put do kupovine koja se isplati.
        </motion.p>
      </div>
      <StoreMapSection isLocationPage />
    </div>
  );
};

export default LokacijePage;
