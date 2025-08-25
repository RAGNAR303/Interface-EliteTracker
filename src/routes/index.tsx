import { createBrowserRouter } from "react-router";
import Login from "../screen/login";
import { Habits } from "../screen/habits";
import { Auth } from "../screen/auth";
import { PrivateRoute } from "./private-route";

// Arquivo que faz o reteamento das páginas
export const router = createBrowserRouter([
  {
    path: "/entrar",
    element: <Login />,
  },
  {
    path: "/habitos",
    element: <PrivateRoute component={<Habits />} />,
  },
  {
    path: "/autenticacao",
    element: <Auth />,
  },
]);
