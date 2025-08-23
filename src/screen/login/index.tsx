import { useNavigate } from "react-router";
import { Button } from "../../components/button";
import styles from "./style.module.css";
import { GithubLogoIcon } from "@phosphor-icons/react";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1>Elite Tracker</h1>
      <div className={styles.loginBox}>
        <h2>Entre Com</h2>
        <Button onClick={() => navigate("/habitos")}>
          <GithubLogoIcon />
          GitHub
        </Button>
        <p>Ao entrar, eu concordo com o Termos de Serviço e Política de Privacidade.</p>
      </div>
    </div>
  );
}
