import { createBrowserRouter } from "react-router";
import Login from "../screen/login";
import { Habits } from "../screen/habits";


// Arquivo que faz o reteamento das páginas
export const router = createBrowserRouter([
  {
    path: "/entrar",
    element: <Login />,
  },
  {
    path: "/habitos",
    element: <Habits />,
  },
]);
