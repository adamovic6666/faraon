import React from "react";
import NextLink from "next/link";

const PageLink = ({
  href = "/",
  children,
}: {
  href?: string;
  children: React.ReactNode;
}) => {
  return (
    <NextLink
      href={href}
      className="w-full md:w-52 mb-5 md:mb-12 inline-block text-center bg-primary hover:bg-primary/85 transition-all text-black/80 px-14 py-4 rounded-full text-lg"
    >
      {children}
    </NextLink>
  );
};

export default PageLink;
