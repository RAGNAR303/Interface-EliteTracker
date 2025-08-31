import { ListChecksIcon, SignOutIcon, TimerIcon } from "@phosphor-icons/react";
import style from "./style.module.css";
import { Link, useLocation, useNavigate } from "react-router";
import { useUser } from "../../hooks/use.user";
import clsx from "clsx";

export function SideBar() {
  const { userData, logout } = useUser();

  const { pathname } = useLocation();

  const navigate = useNavigate();

  function handleLogout() {
    logout();

    navigate("/entrar");
  }

  return (
    <div className={style.container}>
      <img src={userData.avatarUrl} alt="img-perfil" />
      <div className={style.links}>
        <Link to={"/habitos"}>
          <ListChecksIcon
            className={clsx(pathname === "/habitos" && style.active)}
          />
        </Link>
        <Link to={"/foco"}>
          <TimerIcon className={clsx(pathname === "/foco" && style.active)} />
        </Link>
      </div>
      <SignOutIcon onClick={handleLogout} className={style.signout} />
    </div>
  );
}
