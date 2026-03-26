import { cn } from "@/lib/utils";
import React, { InputHTMLAttributes } from "react";

type InputGroupProps = {
  className?: string;
  children: React.ReactNode;
};

type InputTextProps = InputHTMLAttributes<HTMLInputElement>;

const InputGroup = ({ className, children }: InputGroupProps) => {
  return (
    <div
      className={cn(
        "input-group pl-4 transition-all relative flex items-center w-full rounded-full ",
        className ?? "",
      )}
    >
      {children}
    </div>
  );
};

const Input = React.forwardRef<HTMLInputElement, InputTextProps>(
  (props: InputTextProps, ref: any) => {
    const { className, ...rest } = props;

    return (
      <input
        className={cn(
          "bg-section input-control w-full py-2.5 pr-4 text-base text-black/80 placeholder:font-light focus-visible:outline-none  placeholder:text-black/40 focus-visible:ring-1 focus-visible:ring-ring",
          className ?? "",
        )}
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        ref={ref}
        {...rest}
      />
    );
  },
);

const TextArea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>((props, ref: any) => {
  const { className, ...rest } = props;

  return (
    <textarea
      className={cn(
        "bg-section input-control w-full py-2.5 pr-4 text-base text-black/80 placeholder:font-light placeholder:text-black/40 resize-none focus-visible:outline-none focus:ring-1 focus-visible:ring-1 focus-visible:ring-ring",
        className ?? "",
      )}
      autoComplete="off"
      autoCorrect="off"
      spellCheck="false"
      ref={ref}
      rows={5}
      {...rest}
    />
  );
});

InputGroup.TextArea = TextArea;

const InputGroupText = ({ className, children }: InputGroupProps) => {
  return (
    <div className={cn("input-group-text mr-3", className ?? "")}>
      {children}
    </div>
  );
};

InputGroup.Text = InputGroupText;
InputGroup.Input = Input;

export default InputGroup;
