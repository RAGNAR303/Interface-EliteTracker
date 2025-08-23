import type { ComponentProps } from "react";
import style from "./style.module.css";


// tipagem em que as propreadades que o botão ja recebe

type ButtonProps = ComponentProps<"button">;

export function Button({ children, ...props }: ButtonProps) {
  return (
    <button {...props} className={style.container}>
      {children}
    </button>
  );
}
