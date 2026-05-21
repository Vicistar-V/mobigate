import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthGuard }   from "@/components/AuthGuard";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <AuthGuard>
      <App />
    </AuthGuard>
  </AuthProvider>
);
