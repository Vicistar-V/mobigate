import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Landing            from "./pages/Landing";
import Index              from "./pages/Index";
import MyProfile          from "./pages/MyProfile";
import UserProfile        from "./pages/UserProfile";
import PostPage           from "./pages/PostPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import CopyrightDocumentsPage from "./pages/admin/CopyrightDocumentsPage";
import AccountVerificationPage from "./pages/AccountVerificationPage";
import BuyVouchersPage     from "./pages/BuyVouchersPage";
import { ScrollToTop }    from "./components/ScrollToTop";
import { BackToTopButton } from "./components/BackToTopButton";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Standalone routes — no sidebar layout */}
            <Route path="/" element={<Landing />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Main app — inside sidebar layout */}
            <Route path="/*" element={
              <SidebarProvider defaultOpen={true}>
                <div className="flex min-h-screen w-full">
                  <AppSidebar />
                  <div className="flex-1 flex flex-col w-full">
                    <ScrollToTop />
                    <BackToTopButton />
                    <Routes>
                      <Route path="/dashboard"     element={<Index />} />
                      <Route path="/profile"       element={<MyProfile />} />
                      <Route path="/profile/:id"   element={<UserProfile />} />
                      <Route path="/post/:id"      element={<PostPage />} />
                      <Route path="/verify-account" element={<AccountVerificationPage />} />
                      <Route path="/admin/copyright-documents" element={<CopyrightDocumentsPage />} />
                      <Route path="/buy-vouchers"  element={<BuyVouchersPage />} />




                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </div>
                </div>
              </SidebarProvider>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
