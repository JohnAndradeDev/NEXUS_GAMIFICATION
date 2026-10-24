import { Routes, Route } from "react-router";

import Login from "../pages/Login";

export function AuthRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="*" element={<Login />} />
    </Routes>
  );
}
