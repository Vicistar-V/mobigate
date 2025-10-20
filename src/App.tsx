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
import ServiceUnavailable from "./pages/ServiceUnavailable";
import { ScrollToTop } from "./components/ScrollToTop";
import { BackToTopButton } from "./components/BackToTopButton";
import { initializeMockData } from "./data/mockAdvertData";
import { startAdvertSimulator } from "./lib/advertSimulator";

const queryClient = new QueryClient();

const App = () => {
  // Initialize mock data on app load
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
                  <Route path="/mobi-shop" element={<ServiceUnavailable />} />
                  <Route path="/mobi-circle" element={<ServiceUnavailable />} />
                  <Route path="/biz-catalogue" element={<ServiceUnavailable />} />
                  <Route path="/community" element={<ServiceUnavailable />} />
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
