
import { Button } from "../../components/button";
import styles from "./style.module.css";
import { GithubLogoIcon } from "@phosphor-icons/react";

import { api } from "../../services/api";

export default function Login() {


  async function handleAuth() {
    const { data } = await api.get("/auth");

    console.log(data);
    window.location.href = data.redirectUrl;
  }

  return (
    <div className={styles.container}>
      <h1>Elite Tracker</h1>
      <div className={styles.loginBox}>
        <h2>Entre Com</h2>
        <Button onClick={handleAuth}>
          <GithubLogoIcon />
          GitHub
        </Button>
        <p>Ao entrar, eu concordo com o Termos de Serviço e Política de Privacidade.</p>
      </div>
    </div>
  );
}
