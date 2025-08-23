import { ListChecksIcon, SignOutIcon, TimerIcon } from "@phosphor-icons/react";
import style from "./style.module.css";
import { Link } from "react-router";

export function SideBar() {
  return (
    <div className={style.container}>
      <img src="https://github.com/RAGNAR303.png" alt="img-perfil" />
      <div className={style.links}>
        <Link to={"/habitos"}>
          <ListChecksIcon />
        </Link>
        <Link to={"/entrar"}>
          <TimerIcon />
        </Link>
      </div>
      <SignOutIcon className={style.signout} />
    </div>
  );
}
