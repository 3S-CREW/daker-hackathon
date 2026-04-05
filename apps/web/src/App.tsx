import { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"
import { AuthProvider } from "@/app/providers/AuthProvider"
import { Layout } from "@/widgets/layout/Layout"

const LandingPage = lazy(() =>
  import("@/pages/landing/ui/LandingPage").then((m) => ({
    default: m.LandingPage,
  })),
);
const HackathonListPage = lazy(() =>
  import("@/pages/hackathons/ui/HackathonListPage").then((m) => ({
    default: m.HackathonListPage,
  })),
);
const HackathonDetailPage = lazy(() =>
  import("@/pages/hackathons-detail/ui/HackathonDetailPage").then((m) => ({
    default: m.HackathonDetailPage,
  })),
);
const CampPage = lazy(() =>
  import("@/pages/camp/ui/CampPage").then((m) => ({ default: m.CampPage })),
);
const RankingsPage = lazy(() =>
  import("@/pages/rankings/ui/RankingsPage").then((m) => ({
    default: m.RankingsPage,
  })),
);
const PortfolioPage = lazy(() =>
  import("@/pages/portfolio/ui/PortfolioPage").then((m) => ({
    default: m.PortfolioPage,
  })),
);
const DashboardPage = lazy(() =>
  import("@/pages/dashboard/ui/DashboardPage").then((m) => ({
    default: m.DashboardPage,
  })),
);

function PageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-10 h-10 rounded-full border-4 border-[#eef1f3] border-t-[#0064ff] animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" richColors />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={<PageFallback />}>
                <LandingPage />
              </Suspense>
            }
          />
          <Route element={<Layout />}>
            <Route
              path="hackathons"
              element={
                <Suspense fallback={<PageFallback />}>
                  <HackathonListPage />
                </Suspense>
              }
            />
            <Route
              path="hackathons/:slug"
              element={
                <Suspense fallback={<PageFallback />}>
                  <HackathonDetailPage />
                </Suspense>
              }
            />
            <Route
              path="camp"
              element={
                <Suspense fallback={<PageFallback />}>
                  <CampPage />
                </Suspense>
              }
            />
            <Route
              path="rankings"
              element={
                <Suspense fallback={<PageFallback />}>
                  <RankingsPage />
                </Suspense>
              }
            />
            <Route
              path="portfolio"
              element={
                <Suspense fallback={<PageFallback />}>
                  <PortfolioPage />
                </Suspense>
              }
            />
            <Route
              path="dashboard"
              element={
                <Suspense fallback={<PageFallback />}>
                  <DashboardPage />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
