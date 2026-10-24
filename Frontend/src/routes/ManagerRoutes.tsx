import { Routes, Route } from "react-router";

import { ManagerDashboard } from "../pages/ManagerDashboard";
import { ManageSquad } from "../pages/ManageSquad";
import { NotFound } from "../pages/NotFound";
import { Ranking } from "../pages/Ranking";

export function ManagerRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ManagerDashboard />} />
      <Route path="/manage-squad" element={<ManageSquad />} />

      <Route path="/ranking" element={<Ranking />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
