import React from "react";
import { cn } from "@/lib/utils";

const Button = ({
  children,
  className = "",
  variant = "primary",
  type = "button",
  disabled = false,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "brand";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}) => {
  return (
    <div className={cn(`max-w-frame w-full ${className}`)}>
      <button
        type={type}
        disabled={disabled}
        className={cn(
          "inline-block cursor-pointer w-full rounded-full px-10 py-4 text-center transition-all md:w-52 md:px-14 md:text-lg disabled:opacity-60 disabled:cursor-not-allowed",
          variant === "primary" &&
            "bg-primary text-black/80 hover:bg-primary/85",
          variant === "brand" && "bg-brand text-white hover:bg-brand/90",
        )}
      >
        {children}
      </button>
    </div>
  );
};

export default Button;
