import { AppLayout } from "../layouts/AppLayout";
import { ManagerHeader } from "../components/ManagerDashboard/ManagerHeader";
import { SquadMetrics } from "../components/ManagerDashboard/SquadMetrics";
import { SquadTaskForm } from "../components/ManagerDashboard/SquadTaskForm";
import { CorporateRanking } from "../components/ManagerDashboard/CorporateRanking";
import { ActivityTimeline } from "../components/ManagerDashboard/ActivityTimeline";

export function ManagerDashboard() {
  return (
    <AppLayout activePage="manager">
      <div className="flex w-full flex-col pb-space-xl">
        <ManagerHeader />
        <SquadMetrics />
        <SquadTaskForm />

        <section className="grid grid-cols-1 gap-space-lg lg:grid-cols-2">
          <CorporateRanking />
          <ActivityTimeline />
        </section>
      </div>
    </AppLayout>
  );
}
