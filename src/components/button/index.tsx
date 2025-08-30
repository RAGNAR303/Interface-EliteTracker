import type { ComponentProps } from "react";
import style from "./style.module.css";
import clsx from "clsx";

// tipagem em que as propriedades do button, mais adicionou "variant"

type ButtonProps = ComponentProps<"button"> & {
  variant?: "info" | "error";
};

export function Button({ children, disabled, variant, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        style.container,
        variant === "error" && style.error,
        disabled && style.disabled,
      )}
    >
      {children}
    </button>
  );
}
