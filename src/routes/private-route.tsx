import { Navigate } from "react-router";
import { useLocalStorageKey } from "../hooks/use.user";
import type { ReactNode } from "react";

type PrivateRouteProps = {
  component: ReactNode;
};


// função que deixar a tela de Habitos so disponivel se o usuario estiver logado
export function PrivateRoute({ component }: PrivateRouteProps) {

    // Procura se esta logado usando as informações do localstorage
  const userData = localStorage.getItem(useLocalStorageKey);
// Se nao tiver logado ele redireciona para logar
  if (!userData) {
    return <Navigate to={"/entrar"} />;
  }
// Se tiver ele rederiza o componente
  return <>{component}</>;
}
