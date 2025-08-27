import type { ReactNode } from "react";
import style from "./style.module.css";

type AppContainerProps = {
  children: ReactNode;
};

export function AppContainer({ children }: AppContainerProps) {
  return <div className={style.app}>{children}</div>;
}
