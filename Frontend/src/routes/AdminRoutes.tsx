import { Routes, Route } from "react-router";

import { Admin } from "../pages/AdminDashboard";
import { NotFound } from "../pages/NotFound";
import { Ranking } from "../pages/Ranking";

export function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Admin />} />

      <Route path="/ranking" element={<Ranking />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
