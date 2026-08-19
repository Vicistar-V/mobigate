import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AuthGuard } from "@/components/AuthGuard";
import Landing                        from "./pages/Landing";
import Index                          from "./pages/Index";
import MyProfile                      from "./pages/MyProfile";
import UserProfile                    from "./pages/UserProfile";
import PostPage                       from "./pages/PostPage";
import ForgotPasswordPage             from "./pages/ForgotPasswordPage";
import LoginPage                      from "./pages/LoginPage";
import WalletPage                     from "./pages/WalletPage";
import SubmitAdvert                   from "./pages/SubmitAdvert";
import MyAdverts                      from "./pages/MyAdverts";
import AdvertSubscriptionRatesPage    from "./pages/AdvertSubscriptionRatesPage";
import AdvertRatesPage                from "./pages/AdvertRatesPage";
import MobifaceAdminDashboard         from "./pages/admin/MobifaceAdminDashboard";
import MobiQuizGames                  from "./pages/MobiQuizGames";
import MyQuizHistory                  from "./pages/MyQuizHistory";
import AdSlotRatesPage                from "./pages/admin/adverts/AdSlotRatesPage";
import ManageAdvertsPage              from "./pages/admin/adverts/ManageAdvertsPage";
import PromotionalAdsPage             from "./pages/admin/adverts/PromotionalAdsPage";
import CopyrightDocumentsPage         from "./pages/admin/CopyrightDocumentsPage";
import AccountVerificationPage        from "./pages/AccountVerificationPage";
import MerchantListingPage            from "./pages/MerchantListingPage";
import MerchantHomePage               from "./pages/MerchantHomePage";
import MerchantDetailPage             from "./pages/MerchantDetailPage";
import IndividualMerchantApplication  from "./pages/IndividualMerchantApplication";
import MerchantApplication            from "./pages/MerchantApplication";
import MerchantApplicationStatus      from "./pages/MerchantApplicationStatus";
import MerchantPage                   from "./pages/MerchantPage";
import MerchantVoucherManagement      from "./pages/MerchantVoucherManagement";
import MerchantVoucherGenerate        from "./pages/MerchantVoucherGenerate";
import MerchantVoucherBatches         from "./pages/MerchantVoucherBatches";
import MerchantVoucherBatchDetail     from "./pages/MerchantVoucherBatchDetail";
import MerchantVoucherTransactions    from "./pages/MerchantVoucherTransactions";
import MerchantWalletFund             from "./pages/MerchantWalletFund";
import ManageSubMerchants             from "./pages/ManageSubMerchants";
import SubMerchantDetail              from "./pages/SubMerchantDetail";
import SubMerchantApplicationPage     from "./pages/SubMerchantApplicationPage";
import SubMerchantApplicationStatus   from "./pages/SubMerchantApplicationStatus";
import SubMerchantVoucherManagement   from "./pages/SubMerchantVoucherManagement";
import SubMerchantBuyVouchers         from "./pages/SubMerchantBuyVouchers";
import SubMerchantVoucherBatches      from "./pages/SubMerchantVoucherBatches";
import SubMerchantVoucherBatchDetail  from "./pages/SubMerchantVoucherBatchDetail";
import SubMerchantVoucherTransactions from "./pages/SubMerchantVoucherTransactions";
import ManageMerchantsPage            from "./pages/admin/ManageMerchantsPage";
import BuyVouchersPage                from "./pages/BuyVouchersPage";
import Community                      from "./pages/Community";
import SocialCommunities              from "./pages/SocialCommunities";
import CommunityProfile               from "./pages/CommunityProfile";
import CommunityMembershipApplication from "./pages/CommunityMembershipApplication";
import CommunityAdvertRatesPage       from "./pages/community/CommunityAdvertRatesPage";
import CreateAdvertisementPage        from "./pages/community/CommunityCreateAdvertisementPage";
import { ScrollToTop }    from "./components/ScrollToTop";
import { BackToTopButton } from "./components/BackToTopButton";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

// Lazy-load heavy pages only
const CreateCommunityPage     = lazy(() => import("./pages/CreateCommunityPage"));
const ContentModerationPage   = lazy(() => import("./pages/ContentModerationPage"));
const CommunityAdminDashboard = lazy(() => import("./pages/CommunityAdminDashboard"));
const CommunityAuthorizationsPage = lazy(() => import("./pages/CommunityAuthorizationsPage"));
const ElectionManagementPage  = lazy(() => import("./pages/admin/ElectionManagementPage"));
const MyCommunities     = lazy(() => import("./pages/community/MyCommunities"));
const JoinedCommunities = lazy(() => import("./pages/community/JoinedCommunities"));
const ManageCommunities = lazy(() => import("./pages/community/ManageCommunities"));

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Standalone routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Main app — inside sidebar layout */}
            <Route path="/*" element={
              <AuthGuard>
                <SidebarProvider defaultOpen={true}>
                  <div className="flex min-h-screen w-full">
                    <AppSidebar />
                    <div className="flex-1 flex flex-col w-full">
                      <ScrollToTop />
                      <BackToTopButton />
                      <Routes>
                        <Route path="/dashboard"     element={<Index />} />
                        <Route path="/wallet"        element={<WalletPage />} />
                        <Route path="/mobi-quiz-games" element={<MobiQuizGames />} />
                        <Route path="/my-quiz-history" element={<MyQuizHistory />} />
                        <Route path="/submit-advert" element={<SubmitAdvert />} />
                        <Route path="/my-adverts"    element={<MyAdverts />} />
                        <Route path="/advert-subscription-rates" element={<AdvertSubscriptionRatesPage />} />
                        <Route path="/discounted-advert-rates"   element={<AdvertRatesPage />} />
                        <Route path="/mobiface-admin" element={<MobifaceAdminDashboard />} />
                        <Route path="/mobiface-admin/adverts/slot-rates"  element={<AdSlotRatesPage />} />
                        <Route path="/mobiface-admin/adverts/manage"      element={<ManageAdvertsPage />} />
                        <Route path="/mobiface-admin/adverts/promotional" element={<PromotionalAdsPage />} />
                        <Route path="/profile"       element={<MyProfile />} />
                        <Route path="/profile/:id"   element={<UserProfile />} />
                        <Route path="/post/:id"      element={<PostPage />} />
                        <Route path="/verify-account" element={<AccountVerificationPage />} />
                        <Route path="/merchants" element={<MerchantListingPage />} />
                        <Route path="/merchant-home/:merchantId" element={<MerchantHomePage />} />
                        <Route path="/merchant-detail/:merchantId" element={<MerchantDetailPage />} />
                        <Route path="/merchant-application/individual" element={<IndividualMerchantApplication />} />
                        <Route path="/merchant-application/corporate" element={<MerchantApplication />} />
                        <Route path="/merchant-application-status" element={<MerchantApplicationStatus />} />
                        <Route path="/merchant-page" element={<MerchantPage />} />
                        <Route path="/merchant-voucher-management" element={<MerchantVoucherManagement />} />
                        <Route path="/merchant-voucher-generate" element={<MerchantVoucherGenerate />} />
                        <Route path="/merchant-voucher-batches" element={<MerchantVoucherBatches />} />
                        <Route path="/merchant-voucher-batch/:batchId" element={<MerchantVoucherBatchDetail />} />
                        <Route path="/merchant-voucher-transactions" element={<MerchantVoucherTransactions />} />
                        <Route path="/merchant-wallet-fund" element={<MerchantWalletFund />} />
                        <Route path="/merchant-sub-merchants" element={<ManageSubMerchants />} />
                        <Route path="/merchant-sub-merchant/:subMerchantId" element={<SubMerchantDetail />} />
                        <Route path="/apply-sub-merchant/:merchantId" element={<SubMerchantApplicationPage />} />
                        <Route path="/sub-merchant-application-status" element={<SubMerchantApplicationStatus />} />
                        <Route path="/sub-merchant-voucher-management" element={<SubMerchantVoucherManagement />} />
                        <Route path="/sub-merchant-buy-vouchers" element={<SubMerchantBuyVouchers />} />
                        <Route path="/sub-merchant-voucher-batches" element={<SubMerchantVoucherBatches />} />
                        <Route path="/sub-merchant-voucher-batch/:batchId" element={<SubMerchantVoucherBatchDetail />} />
                        <Route path="/sub-merchant-voucher-transactions" element={<SubMerchantVoucherTransactions />} />
                        <Route path="/mobiface-admin/merchants" element={<ManageMerchantsPage />} />
                        <Route path="/admin/copyright-documents" element={<CopyrightDocumentsPage />} />
                        <Route path="/buy-vouchers"  element={<BuyVouchersPage />} />

                        {/* Community routes */}
                        <Route path="/community"                          element={<SocialCommunities />} />
                        <Route path="/community/my"     element={<Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}><MyCommunities /></Suspense>} />
                        <Route path="/community/joined"  element={<Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}><JoinedCommunities /></Suspense>} />
                        <Route path="/community/manage"  element={<Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}><ManageCommunities /></Suspense>} />
                        <Route path="/community/:communityId"             element={<CommunityProfile />} />
                        <Route path="/community/:communityId/apply"       element={<CommunityMembershipApplication />} />
                        <Route path="/community/:communityId/advert-rates" element={<CommunityAdvertRatesPage />} />
                        <Route path="/community/:communityId/create-advert" element={<CreateAdvertisementPage />} />
                        <Route path="/community/:communityId/admin" element={
                          <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
                            <CommunityAdminDashboard />
                          </Suspense>
                        } />
                        <Route path="/community/:communityId/admin/content" element={
                          <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
                            <ContentModerationPage />
                          </Suspense>
                        } />
                        <Route path="/community/:communityId/admin/elections" element={
                          <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
                            <ElectionManagementPage />
                          </Suspense>
                        } />
                        <Route path="/community/:communityId/admin/authorizations" element={
                          <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
                            <CommunityAuthorizationsPage />
                          </Suspense>
                        } />
                        <Route path="/create-community" element={
                          <Suspense fallback={<div className="flex-1 flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
                            <CreateCommunityPage />
                          </Suspense>
                        } />

                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                      </Routes>
                    </div>
                  </div>
                </SidebarProvider>
              </AuthGuard>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;