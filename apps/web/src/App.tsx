import { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "@/app/providers/AuthProvider"
import { Layout } from "@/widgets/layout/Layout"

const HomePage = lazy(() => import("@/pages/home/ui/HomePage").then((m) => ({ default: m.HomePage })))
const HackathonListPage = lazy(() => import("@/pages/hackathons/ui/HackathonListPage").then((m) => ({ default: m.HackathonListPage })))
const HackathonDetailPage = lazy(() => import("@/pages/hackathons-detail/ui/HackathonDetailPage").then((m) => ({ default: m.HackathonDetailPage })))
const CampPage = lazy(() => import("@/pages/camp/ui/CampPage").then((m) => ({ default: m.CampPage })))
const RankingsPage = lazy(() => import("@/pages/rankings/ui/RankingsPage").then((m) => ({ default: m.RankingsPage })))

function PageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-10 h-10 rounded-full border-4 border-[#eef1f3] border-t-[#0064ff] animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Suspense fallback={<PageFallback />}><HomePage /></Suspense>} />
            <Route path="hackathons" element={<Suspense fallback={<PageFallback />}><HackathonListPage /></Suspense>} />
            <Route path="hackathons/:slug" element={<Suspense fallback={<PageFallback />}><HackathonDetailPage /></Suspense>} />
            <Route path="camp" element={<Suspense fallback={<PageFallback />}><CampPage /></Suspense>} />
            <Route path="rankings" element={<Suspense fallback={<PageFallback />}><RankingsPage /></Suspense>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
