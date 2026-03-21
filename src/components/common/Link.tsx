import React from "react";
import NextLink from "next/link";
import { cn } from "@/lib/utils";

const PageLink = ({
  href = "/",
  children,
  className = "",
  inCenter = false,
  variant = "primary",
}: {
  href?: string;
  children: React.ReactNode;
  className?: string;
  inCenter?: boolean;
  variant?: "primary" | "brand";
}) => {
  return (
    <div
      className={`max-w-frame w-full ${className} ${inCenter ? "md:flex md:items-center md:justify-center" : ""}`}
    >
      <NextLink
        href={href}
        className={cn(
          "inline-block w-full rounded-full px-10 py-4 text-center transition-all md:w-52 md:px-14 md:text-lg",
          variant === "primary" &&
            "bg-primary text-black/80 hover:bg-primary/85",
          variant === "brand" && "bg-brand text-white hover:bg-brand/90",
        )}
      >
        {children}
      </NextLink>
    </div>
  );
};

export default PageLink;
