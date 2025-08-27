import { createBrowserRouter } from "react-router";
import Login from "../screen/login";
import { Habits } from "../screen/habits";
import { Auth } from "../screen/auth";
import { PrivateRoute } from "./private-route";
import { Focus } from "../screen/focus";

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
    path: "/foco",
    element: <PrivateRoute component={<Focus />} />,
  },
  {
    path: "/autenticacao",
    element: <Auth />,
  },
]);
