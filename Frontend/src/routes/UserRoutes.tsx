import { Routes, Route } from "react-router";

import { UserDashboard } from "../pages/UserDashboard";
import { SquadPanel } from "../pages/SquadPanel";
import { NotFound } from "../pages/NotFound";
import { Ranking } from "../pages/Ranking";

export function UserRoutes() {
  return (
    <Routes>
      <Route path="/" element={<UserDashboard />} />
      <Route path="/squad" element={<SquadPanel />} />

      <Route path="/ranking" element={<Ranking />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
