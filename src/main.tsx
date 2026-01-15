import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/app/index.css";
import App from "@/app/App.tsx";
import { AppProviders } from "@/app/providers";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>
);
