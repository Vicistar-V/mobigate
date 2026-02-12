import { MobigateAdminHeader } from "@/components/mobigate/MobigateAdminHeader";
import { MobigateQuizLevelsManagement } from "@/components/mobigate/MobigateQuizLevelsManagement";

export default function QuizLevelsPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <MobigateAdminHeader title="Quiz Levels" subtitle="Manage Stakes & Tiers" />
      <div className="p-4">
        <MobigateQuizLevelsManagement />
      </div>
    </div>
  );
}
