import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthGuard }   from "@/components/AuthGuard";
import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <AuthProvider>
      <AuthGuard>
        <App />
      </AuthGuard>
    </AuthProvider>
  </HelmetProvider>
);
