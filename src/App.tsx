import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AuthGuard } from "@/components/AuthGuard";
import Landing            from "./pages/Landing";
import Index              from "./pages/Index";
import MyProfile          from "./pages/MyProfile";
import UserProfile        from "./pages/UserProfile";
import PostPage           from "./pages/PostPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
<<<<<<< Updated upstream
import CopyrightDocumentsPage from "./pages/admin/CopyrightDocumentsPage";
import AccountVerificationPage from "./pages/AccountVerificationPage";
import BuyVouchersPage     from "./pages/BuyVouchersPage";
=======
import Community          from "./pages/Community";
import CommunityProfile   from "./pages/CommunityProfile";
import CommunityMembershipApplication from "./pages/CommunityMembershipApplication";
>>>>>>> Stashed changes
import { ScrollToTop }    from "./components/ScrollToTop";
import { BackToTopButton } from "./components/BackToTopButton";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

// Lazy-load heavy pages
const CreateCommunityPage = lazy(() => import("./pages/CreateCommunityPage"));
const ContentModerationPage = lazy(() => import("./pages/ContentModerationPage"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="flex-1 flex items-center justify-center min-h-[60vh]">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
<<<<<<< Updated upstream
            {/* Standalone routes — no sidebar layout */}
            <Route path="/" element={<Landing />} />
=======
            {/* Outside sidebar */}
>>>>>>> Stashed changes
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

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
<<<<<<< Updated upstream
                      <Route path="/dashboard"     element={<Index />} />
                      <Route path="/profile"       element={<MyProfile />} />
                      <Route path="/profile/:id"   element={<UserProfile />} />
                      <Route path="/post/:id"      element={<PostPage />} />
                      <Route path="/verify-account" element={<AccountVerificationPage />} />
                      <Route path="/admin/copyright-documents" element={<CopyrightDocumentsPage />} />
                      <Route path="/buy-vouchers"  element={<BuyVouchersPage />} />




                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
=======
                      <Route path="/"                       element={<Index />} />
                      <Route path="/profile"                element={<MyProfile />} />
                      <Route path="/profile/:id"            element={<UserProfile />} />
                      <Route path="/post/:id"               element={<PostPage />} />
                      {/* Community routes */}
                      <Route path="/community"              element={<Community />} />
                      <Route path="/community/:communityId"       element={<CommunityProfile />} />
                      <Route path="/community/:communityId/apply" element={<CommunityMembershipApplication />} />
                      <Route path="/community/:communityId/admin/content" element={
                        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
                          <ContentModerationPage />
                        </Suspense>
                      } />
                      <Route path="/create-community"            element={
                        <Suspense fallback={<PageLoader />}>
                          <CreateCommunityPage />
                        </Suspense>
                      } />
                      <Route path="*" element={<Navigate to="/" replace />} />
>>>>>>> Stashed changes
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
