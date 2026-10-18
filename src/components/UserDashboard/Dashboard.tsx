import { AppLayout } from "../../layouts/AppLayout";
import { XpToast } from "../../components/UserDashboard/XpToast";
import { DashboardHero } from "../../components/UserDashboard/DashboardHero";
import { QuickMetrics } from "../../components/UserDashboard/QuickMetrics";
import { IndividualTasks } from "../../components/UserDashboard/IndividualTasks";
import { SquadTasks } from "../../components/UserDashboard/SquadTasks";
import { SquadRanking } from "../../components/UserDashboard/SquadRanking";
import { RecentAchievements } from "../../components/UserDashboard/RecentAchievements";

export function Dashboard() {
  return (
    <AppLayout activePage="user">
      <div className="flex w-full flex-col pb-space-xl">
        <XpToast />
        <DashboardHero />
        <QuickMetrics />

        <div className="grid w-full grid-cols-1 gap-space-lg lg:grid-cols-12">
          <div className="flex flex-col gap-space-lg lg:col-span-7">
            <IndividualTasks />
            <SquadTasks />
          </div>

          <div className="flex flex-col gap-space-lg lg:col-span-5">
            <SquadRanking />
            <RecentAchievements />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
