import { MobigateAdminHeader } from "@/components/mobigate/MobigateAdminHeader";
import { MobigateQuizManagement } from "@/components/mobigate/MobigateQuizManagement";

export default function MobigateQuizManagementPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <MobigateAdminHeader 
        title="Quiz Management"
        subtitle="Create & Manage Quiz Content"
      />
      <div className="p-4">
        <MobigateQuizManagement />
      </div>
    </div>
  );
}
