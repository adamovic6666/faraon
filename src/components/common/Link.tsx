import React from "react";
import NextLink from "next/link";

const PageLink = ({
  href = "/",
  children,
  className = "",
  inCenter = false,
}: {
  href?: string;
  children: React.ReactNode;
  className?: string;
  inCenter?: boolean;
}) => {
  return (
    <div
      className={`max-w-frame w-full ${className} ${inCenter ? "md:flex md:items-center md:justify-center" : ""}`}
    >
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
