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
  noAnimation?: boolean;
};

const SectionTitle = ({
  title,
  description,
  className,
  titleClassName,
  descriptionClassName,
  noAnimation = false,
}: SectionTitleProps) => {
  return (
    <div className={cn("text-center", className)}>
      <motion.h2
        initial={
          noAnimation ? { y: 0, opacity: 1 } : { y: "100px", opacity: 0 }
        }
        whileInView={
          noAnimation ? { y: 0, opacity: 1 } : { y: "0", opacity: 1 }
        }
        viewport={{ once: true }}
        transition={noAnimation ? { duration: 0 } : { duration: 0.6 }}
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
          initial={
            noAnimation ? { y: 0, opacity: 1 } : { y: "60px", opacity: 0 }
          }
          whileInView={
            noAnimation ? { y: 0, opacity: 1 } : { y: "0", opacity: 1 }
          }
          viewport={{ once: true }}
          transition={
            noAnimation ? { duration: 0 } : { delay: 0.1, duration: 0.6 }
          }
          className={cn(
            "text-black/80 text-center text-md sm:text-lg max-w-2xl mx-auto leading-relaxed mt-2 font-light",
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
