import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import SubmitAdvert from "./pages/SubmitAdvert";
import MyAdverts from "./pages/MyAdverts";
import AdminManageAdverts from "./pages/AdminManageAdverts";
import AdSlotRatesPage from "./pages/admin/adverts/AdSlotRatesPage";
import ManageAdvertsPage from "./pages/admin/adverts/ManageAdvertsPage";
import PromotionalAdsPage from "./pages/admin/adverts/PromotionalAdsPage";
import Community from "./pages/Community";
import CreateCommunity from "./pages/CreateCommunity";
import CommunityProfile from "./pages/CommunityProfile";
import CommunityMembershipApplication from "./pages/CommunityMembershipApplication";
import CommunityAdminDashboard from "./pages/CommunityAdminDashboard";
import ElectionManagementPage from "./pages/admin/ElectionManagementPage";
import ContentModerationPage from "./pages/admin/ContentModerationPage";
import MobigateAdminDashboard from "./pages/admin/MobigateAdminDashboard";
import QuizCategoriesPage from "./pages/admin/quiz/QuizCategoriesPage";
import QuizLevelsPage from "./pages/admin/quiz/QuizLevelsPage";
import CreateQuestionPage from "./pages/admin/quiz/CreateQuestionPage";
import ManageQuestionsPage from "./pages/admin/quiz/ManageQuestionsPage";
import MonitorQuizPage from "./pages/admin/quiz/MonitorQuizPage";
import QuizGamesPlayedPage from "./pages/admin/quiz/QuizGamesPlayedPage";
import MerchantPage from "./pages/MerchantPage";
import ServiceUnavailable from "./pages/ServiceUnavailable";
import MyQuizHistory from "./pages/MyQuizHistory";
import MobiQuizGames from "./pages/MobiQuizGames";
import { ScrollToTop } from "./components/ScrollToTop";
import { BackToTopButton } from "./components/BackToTopButton";
import { initializeMockData } from "./data/mockAdvertData";
import { startAdvertSimulator } from "./lib/advertSimulator";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    initializeMockData();
    startAdvertSimulator();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider defaultOpen={true}>
            <div className="flex min-h-screen w-full">
              <AppSidebar />
              <div className="flex-1 flex flex-col w-full">
                <ScrollToTop />
                <BackToTopButton />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/profile/:userId" element={<Profile />} />
                  <Route path="/submit-advert" element={<SubmitAdvert />} />
                  <Route path="/my-adverts" element={<MyAdverts />} />
                  <Route path="/admin/manage-adverts" element={<Navigate to="/mobigate-admin/adverts/manage" replace />} />
                  <Route path="/mobigate-admin/adverts/slot-rates" element={<AdSlotRatesPage />} />
                  <Route path="/mobigate-admin/adverts/manage" element={<ManageAdvertsPage />} />
                  <Route path="/mobigate-admin/adverts/promotional" element={<PromotionalAdsPage />} />
                  <Route path="/mobi-shop" element={<ServiceUnavailable />} />
                  <Route path="/mobi-circle" element={<ServiceUnavailable />} />
                  <Route path="/biz-catalogue" element={<ServiceUnavailable />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/community/:communityId" element={<CommunityProfile />} />
                  <Route path="/community/:communityId/join" element={<CommunityMembershipApplication />} />
                  <Route path="/community/:communityId/admin" element={<CommunityAdminDashboard />} />
                  <Route path="/community/:communityId/admin/elections" element={<ElectionManagementPage />} />
                  <Route path="/community/:communityId/admin/content" element={<ContentModerationPage />} />
                  <Route path="/mobigate-admin" element={<MobigateAdminDashboard />} />

                  {/* Quiz type-scoped routes */}
                  <Route path="/mobigate-admin/quiz/:quizType/categories" element={<QuizCategoriesPage />} />
                  <Route path="/mobigate-admin/quiz/:quizType/levels" element={<QuizLevelsPage />} />
                  <Route path="/mobigate-admin/quiz/:quizType/questions/create" element={<CreateQuestionPage />} />
                  <Route path="/mobigate-admin/quiz/:quizType/questions" element={<ManageQuestionsPage />} />
                  <Route path="/mobigate-admin/quiz/:quizType/monitor" element={<MonitorQuizPage />} />
                  <Route path="/merchant-page" element={<MerchantPage />} />

                  {/* Legacy routes redirect to group */}
                  <Route path="/mobigate-admin/quiz/categories" element={<Navigate to="/mobigate-admin/quiz/group/categories" replace />} />
                  <Route path="/mobigate-admin/quiz/levels" element={<Navigate to="/mobigate-admin/quiz/group/levels" replace />} />
                  <Route path="/mobigate-admin/quiz/questions/create" element={<Navigate to="/mobigate-admin/quiz/group/questions/create" replace />} />
                  <Route path="/mobigate-admin/quiz/questions" element={<Navigate to="/mobigate-admin/quiz/group/questions" replace />} />
                  <Route path="/mobigate-admin/quiz/monitor" element={<Navigate to="/mobigate-admin/quiz/group/monitor" replace />} />

                  <Route path="/mobigate-admin/quiz/games-played" element={<QuizGamesPlayedPage />} />
                  <Route path="/create-community" element={<CreateCommunity />} />
                  <Route path="/my-quiz-history" element={<MyQuizHistory />} />
                  <Route path="/mobi-quiz-games" element={<MobiQuizGames />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </div>
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
