import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/index.css";
import Router from "@/route/Route.tsx";
import { AuthProvider } from "@/provider/AuthProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <Router />
    </AuthProvider>
  </StrictMode>
);
