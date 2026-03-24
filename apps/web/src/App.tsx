import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "@/app/providers/AuthProvider"
import { Layout } from "@/widgets/layout/Layout"
import { HomePage } from "@/pages/home/ui/HomePage"
import { HackathonListPage } from "@/pages/hackathons/ui/HackathonListPage"
import { HackathonDetailPage } from "@/pages/hackathons-detail/ui/HackathonDetailPage"
import { CampPage } from "@/pages/camp/ui/CampPage"
import { RankingsPage } from "@/pages/rankings/ui/RankingsPage"

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="hackathons" element={<HackathonListPage />} />
          <Route path="hackathons/:slug" element={<HackathonDetailPage />} />
          <Route path="camp" element={<CampPage />} />
          <Route path="rankings" element={<RankingsPage />} />
        </Route>
      </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
