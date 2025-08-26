import { ListChecksIcon, SignOutIcon, TimerIcon } from "@phosphor-icons/react";
import style from "./style.module.css";
import { Link, useNavigate } from "react-router";
import { useUser } from "../../hooks/use.user";

export function SideBar() {
  const { userData, logout } = useUser();

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
          <ListChecksIcon />
        </Link>
        <Link to={"/entrar"}>
          <TimerIcon />
        </Link>
      </div>
      <SignOutIcon onClick={handleLogout} className={style.signout} />
    </div>
  );
}
