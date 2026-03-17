import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import * as motion from "framer-motion/client";

const Header = () => {
  return (
    <header className="bg-brand overflow-hidden flex flex-col">
      <div className="flex-1 md:max-w-frame w-full mx-auto grid grid-cols-1 md:grid-cols-3">
        <section className="min-h-[calc(100vh-132px)] col-span-2 px-4 flex flex-col justify-center items-start py-10 md:py-0">
          <motion.h2
            initial={{ y: "100px", opacity: 0, rotate: 10 }}
            whileInView={{ y: "0", opacity: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={cn([
              integralCF.className,
              "text-5xl lg:text-[72px] lg:leading-[78px] mb-2 lg:mb-4 text-white",
            ])}
          >
            SVE STO PIJETE, <br />
            FARAON DONOSI!
          </motion.h2>
          <motion.p
            initial={{ y: "100px", opacity: 0 }}
            whileInView={{ y: "0", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-white text-sm lg:text-base mb-8 lg:mb-10 max-w-[545px]"
          >
            Najbrža dostava i najniže cene pića u Novom Sadu.
          </motion.p>
          <motion.div
            initial={{ y: "100px", opacity: 0 }}
            whileInView={{ y: "0", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/shop"
              className="bg-gold text-amber-900 w-full sm:w-auto text-center transition-all font-semibold px-10 py-4 rounded-full"
            >
              Naruči odmah
            </Link>
            <Link
              href="tel:+381"
              className="w-full sm:w-auto text-center border-2 border-gold text-amber-900 hover:bg-gold hover:text-amber-900 transition-all px-10 py-4 rounded-full"
            >
              Pozovi nas
            </Link>
          </motion.div>
        </section>
        <motion.section
          initial={{ y: "100px", opacity: 0, rotate: 10 }}
          whileInView={{ y: "0", opacity: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 2.3, duration: 0.8 }}
          // className="relative md:px-4 min-h-[45vh] md:min-h-0 bg-cover bg-top xl:bg-[center_top_-1.6rem] bg-no-repeat bg-[url('/images/header-res-homepage.png')] md:bg-[url('/images/header-homepage.png')]"
        />
      </div>
    </header>
  );
};

export default Header;
