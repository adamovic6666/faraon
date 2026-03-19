import React from "react";
import NextLink from "next/link";
import { div } from "framer-motion/client";

const PageLink = ({
  href = "/",
  children,
}: {
  href?: string;
  children: React.ReactNode;
}) => {
  return (
    <div>
      <NextLink
        href={href}
        className="w-full md:w-52 mb-5 md:mb-12 inline-block text-center bg-primary hover:bg-primary/85 transition-all text-black/80 px-10 py-2 md:px-14 md:py-4 rounded-full text:md md:text-lg"
      >
        {children}
      </NextLink>
    </div>
  );
};

export default PageLink;
