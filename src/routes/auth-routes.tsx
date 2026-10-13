import { Routes, Route } from "react-router";

import Login from "../pages/Login";
import { NotFound } from "../pages/NotFound";

export function AuthRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
}
