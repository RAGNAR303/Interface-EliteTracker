import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./styles/global.css";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { UserProvider } from "./hooks/use.user";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>,
);
