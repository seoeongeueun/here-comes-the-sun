import { BrowserRouter, Routes, Route } from "react-router-dom";
import { routes } from "@/shared/config/routes";
import { InfoPage } from "@/pages/info";
import { MainPage } from "@/pages/main";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.home} element={<MainPage />} />
        <Route path={routes.info} element={<InfoPage />} />{" "}
      </Routes>
    </BrowserRouter>
  );
}
