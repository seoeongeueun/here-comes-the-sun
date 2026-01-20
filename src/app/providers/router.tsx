import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  useLocation,
} from "react-router-dom";
import { routes } from "@/shared/config/routes";
import { InfoPage } from "@/pages/info";
import { MainPage } from "@/pages/main";
import { KakaoMap } from "@/widgets/kakao-maps";
import { Header } from "@/widgets/dashboard/ui/Header";

function Layout() {
  const location = useLocation();
  const isInfoPage = location.pathname.startsWith("/info");

  return (
    <div
      className={`${isInfoPage ? "max-w-[1000px]" : "max-w-[1800px]"} h-full w-full flex flex-col justify-self-center`}
    >
      <Header />
      <div className="flex flex-col md:flex-row w-full h-full md:h-[calc(100%-80px)]">
        <section
          className={`p-4 md:p-6 lg:p-10 md:pt-2 lg:pt-4 w-full md:w-1/2 h-1/2 shrink-0 md:h-full ${isInfoPage ? "hidden" : ""}`}
        >
          <KakaoMap />
        </section>
        <section
          className={`${isInfoPage ? "w-full" : "w-full md:w-1/2"} h-full px-4 md:px-0`}
        >
          <Outlet />
        </section>
      </div>
    </div>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path={routes.home} element={<MainPage />} />
          <Route path={routes.info} element={<InfoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
