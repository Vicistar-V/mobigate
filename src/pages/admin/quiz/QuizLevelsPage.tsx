import { Header } from "@/components/Header";
import { MobigateQuizLevelsManagement } from "@/components/mobigate/MobigateQuizLevelsManagement";

export default function QuizLevelsPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <div className="p-4">
        <h1 className="text-lg font-bold mb-3">Quiz Levels</h1>
        <MobigateQuizLevelsManagement />
      </div>
    </div>
  );
}
