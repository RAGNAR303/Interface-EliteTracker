import style from "./style.module.css";
import { useNavigate, useSearchParams } from "react-router";
import { useEffect } from "react";
import { useUser } from "../../hooks/use.user";

export function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getUserInfo } = useUser();

  async function handleAuth() {
    // espera a API mandar "code"
    await getUserInfo(String(searchParams.get("code")));
    // navegação para tela de habitos
    navigate("/habitos");
  }
  // Rederiza , e redireciona para dela de habitos
  useEffect(() => {
    handleAuth();
  }, []);

  return (
    <div className={style.container}>
      <h1>Carregando aplicação...</h1>
    </div>
  );
}
