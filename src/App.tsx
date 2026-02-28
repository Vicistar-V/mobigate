import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import SubmitAdvert from "./pages/SubmitAdvert";
import MyAdverts from "./pages/MyAdverts";
import AdminManageAdverts from "./pages/AdminManageAdverts";
import AdSlotRatesPage from "./pages/admin/adverts/AdSlotRatesPage";
import AdvertRatesPage from "./pages/AdvertRatesPage";
import AdvertSubscriptionRatesPage from "./pages/AdvertSubscriptionRatesPage";
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
import ManageMerchantsPage from "./pages/admin/ManageMerchantsPage";
import QuizCategoriesPage from "./pages/admin/quiz/QuizCategoriesPage";
import QuizLevelsPage from "./pages/admin/quiz/QuizLevelsPage";
import CreateQuestionPage from "./pages/admin/quiz/CreateQuestionPage";
import ManageQuestionsPage from "./pages/admin/quiz/ManageQuestionsPage";
import MonitorQuizPage from "./pages/admin/quiz/MonitorQuizPage";
import QuizGamesPlayedPage from "./pages/admin/quiz/QuizGamesPlayedPage";
import MerchantPage from "./pages/MerchantPage";
import MerchantApplication from "./pages/MerchantApplication";
import IndividualMerchantApplication from "./pages/IndividualMerchantApplication";
import MerchantDetailPage from "./pages/MerchantDetailPage";
import MerchantHomePage from "./pages/MerchantHomePage";
import MerchantListingPage from "./pages/MerchantListingPage";
import BuyVouchersPage from "./pages/BuyVouchersPage";
import MerchantVoucherManagement from "./pages/MerchantVoucherManagement";
import MerchantVoucherGenerate from "./pages/MerchantVoucherGenerate";
import MerchantWalletFund from "./pages/MerchantWalletFund";
import MerchantVoucherBatches from "./pages/MerchantVoucherBatches";
import MerchantVoucherBatchDetail from "./pages/MerchantVoucherBatchDetail";
import MerchantVoucherTransactions from "./pages/MerchantVoucherTransactions";
import ManageSubMerchants from "./pages/ManageSubMerchants";
import SubMerchantDetail from "./pages/SubMerchantDetail";
import SubMerchantVoucherManagement from "./pages/SubMerchantVoucherManagement";
import SubMerchantBuyVouchers from "./pages/SubMerchantBuyVouchers";
import SubMerchantVoucherBatches from "./pages/SubMerchantVoucherBatches";
import SubMerchantVoucherBatchDetail from "./pages/SubMerchantVoucherBatchDetail";
import SubMerchantVoucherTransactions from "./pages/SubMerchantVoucherTransactions";
import SubMerchantApplicationPage from "./pages/SubMerchantApplicationPage";
import MerchantApplicationStatus from "./pages/MerchantApplicationStatus";
import SubMerchantApplicationStatus from "./pages/SubMerchantApplicationStatus";
import ServiceUnavailable from "./pages/ServiceUnavailable";
import CreateAdvertisementPage from "./pages/community/CommunityCreateAdvertisementPage";
import CommunityAdvertRatesPage from "./pages/community/CommunityAdvertRatesPage";
import MyQuizHistory from "./pages/MyQuizHistory";
import MobiQuizGames from "./pages/MobiQuizGames";
import WalletPage from "./pages/WalletPage";
import { ScrollToTop } from "./components/ScrollToTop";
import { BackToTopButton } from "./components/BackToTopButton";
import { initializeMockData } from "./data/mockAdvertData";
import { startAdvertSimulator } from "./lib/advertSimulator";

const queryClient = new QueryClient();

const WithHeader = ({ children }: { children: React.ReactNode }) => <><Header />{children}</>;

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
                  <Route path="/community/:communityId/create-advert" element={<CreateAdvertisementPage />} />
                  <Route path="/community/:communityId/admin" element={<CommunityAdminDashboard />} />
                  <Route path="/community/:communityId/admin/elections" element={<ElectionManagementPage />} />
                  <Route path="/community/:communityId/admin/content" element={<ContentModerationPage />} />
                  <Route path="/mobigate-admin" element={<MobigateAdminDashboard />} />
                  <Route path="/mobigate-admin/merchants" element={<ManageMerchantsPage />} />

                  {/* Quiz type-scoped routes */}
                  <Route path="/mobigate-admin/quiz/:quizType/categories" element={<QuizCategoriesPage />} />
                  <Route path="/mobigate-admin/quiz/:quizType/levels" element={<QuizLevelsPage />} />
                  <Route path="/mobigate-admin/quiz/:quizType/questions/create" element={<CreateQuestionPage />} />
                  <Route path="/mobigate-admin/quiz/:quizType/questions" element={<ManageQuestionsPage />} />
                  <Route path="/mobigate-admin/quiz/:quizType/monitor" element={<MonitorQuizPage />} />
                  <Route path="/merchant-page" element={<MerchantPage />} />
                  <Route path="/merchant-application/individual" element={<IndividualMerchantApplication />} />
                  <Route path="/merchant-application/corporate" element={<MerchantApplication />} />

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
                  <Route path="/mobi-quiz-games/merchant/:merchantId" element={<MerchantDetailPage />} />
                  <Route path="/merchants" element={<MerchantListingPage />} />
                  <Route path="/wallet" element={<WithHeader><WalletPage /></WithHeader>} />
                  <Route path="/buy-vouchers" element={<WithHeader><BuyVouchersPage /></WithHeader>} />
                  <Route path="/merchant-voucher-management" element={<WithHeader><MerchantVoucherManagement /></WithHeader>} />
                  <Route path="/merchant-voucher-generate" element={<WithHeader><MerchantVoucherGenerate /></WithHeader>} />
                  <Route path="/merchant-wallet-fund" element={<WithHeader><MerchantWalletFund /></WithHeader>} />
                  <Route path="/merchant-voucher-batches" element={<WithHeader><MerchantVoucherBatches /></WithHeader>} />
                  <Route path="/merchant-voucher-batch/:batchId" element={<WithHeader><MerchantVoucherBatchDetail /></WithHeader>} />
                  <Route path="/merchant-voucher-transactions" element={<WithHeader><MerchantVoucherTransactions /></WithHeader>} />
                  <Route path="/merchant-sub-merchants" element={<WithHeader><ManageSubMerchants /></WithHeader>} />
                  <Route path="/merchant-sub-merchant/:subMerchantId" element={<WithHeader><SubMerchantDetail /></WithHeader>} />
                  <Route path="/sub-merchant-voucher-management" element={<WithHeader><SubMerchantVoucherManagement /></WithHeader>} />
                  <Route path="/sub-merchant-buy-vouchers" element={<WithHeader><SubMerchantBuyVouchers /></WithHeader>} />
                  <Route path="/sub-merchant-voucher-batches" element={<WithHeader><SubMerchantVoucherBatches /></WithHeader>} />
                  <Route path="/sub-merchant-voucher-batch/:batchId" element={<WithHeader><SubMerchantVoucherBatchDetail /></WithHeader>} />
                  <Route path="/sub-merchant-voucher-transactions" element={<WithHeader><SubMerchantVoucherTransactions /></WithHeader>} />
                  <Route path="/merchant-home/:merchantId" element={<MerchantHomePage />} />
                  <Route path="/apply-sub-merchant/:merchantId" element={<WithHeader><SubMerchantApplicationPage /></WithHeader>} />
                  <Route path="/merchant-application-status" element={<WithHeader><MerchantApplicationStatus /></WithHeader>} />
                  <Route path="/sub-merchant-application-status" element={<WithHeader><SubMerchantApplicationStatus /></WithHeader>} />
                  <Route path="/discounted-advert-rates" element={<AdvertRatesPage />} />
                  <Route path="/advert-subscription-rates" element={<AdvertSubscriptionRatesPage />} />
                  <Route path="/community/:communityId/advert-rates" element={<CommunityAdvertRatesPage />} />
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
