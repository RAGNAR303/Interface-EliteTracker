import { RouterProvider } from "react-router";
import { UserProvider } from "./hooks/use.user";
import { router } from "./routes";


export function App() {
  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}
