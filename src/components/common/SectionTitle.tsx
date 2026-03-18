import * as motion from "framer-motion/client";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";

type SectionTitleProps = {
  title: string;
  description?: ReactNode;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

const SectionTitle = ({
  title,
  description,
  className,
  titleClassName,
  descriptionClassName,
}: SectionTitleProps) => {
  return (
    <div className={cn("text-center", className)}>
      <motion.h2
        initial={{ y: "100px", opacity: 0 }}
        whileInView={{ y: "0", opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={cn(
          integralCF.className,
          "text-[32px] text-brand md:text-5xl uppercase text-center font-semibold",
          titleClassName,
        )}
      >
        {title}
      </motion.h2>

      {description && (
        <motion.p
          initial={{ y: "60px", opacity: 0 }}
          whileInView={{ y: "0", opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className={cn(
            "text-black/80 text-center text-lg sm:text-2xl max-w-3xl mx-auto leading-relaxed mt-2",
            descriptionClassName,
          )}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
};

export default SectionTitle;
