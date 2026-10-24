import { BrowserRouter } from "react-router";

import { AuthRoutes } from "./auth-routes";

export function Routes() {
  return (
    <BrowserRouter>
      <AuthRoutes />
    </BrowserRouter>
  );
}
