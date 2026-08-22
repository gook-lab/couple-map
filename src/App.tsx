import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./contexts/ThemeContext";
import { initAuthListener } from "./store/use-auth-store";
import AuthGuard from "./components/auth/AuthGuard";
import MainLayout from "./components/layout/MainLayout";
import ErrorBoundary from "./components/shared/ErrorBoundary";

const Login = lazy(() => import("./pages/Login"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Today = lazy(() => import("./pages/Today"));
const Travel = lazy(() => import("./pages/Travel"));
const Compose = lazy(() => import("./pages/Compose"));
const Timeline = lazy(() => import("./pages/Timeline"));
const Profile = lazy(() => import("./pages/Profile"));
const Calendar = lazy(() => import("./pages/Calendar"));
const CountrySelect = lazy(() => import("./pages/add/CountrySelect"));
const RegionSelect = lazy(() => import("./pages/add/RegionSelect"));
const PlaceSearchPage = lazy(() => import("./pages/add/PlaceSearchPage"));
const PinForm = lazy(() => import("./pages/add/PinForm"));
const MemoryDetail = lazy(() => import("./pages/MemoryDetail"));
const RegionDetail = lazy(() => import("./pages/RegionDetail"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Chat = lazy(() => import("./pages/Chat"));
const LocationShare = lazy(() => import("./pages/LocationShare"));
const Explore = lazy(() => import("./pages/Explore"));
const Stickers = lazy(() => import("./pages/Stickers"));
const Travelogue = lazy(() => import("./pages/Travelogue"));
const Print = lazy(() => import("./pages/Print"));
const VoiceMemo = lazy(() => import("./pages/VoiceMemo"));
const Search = lazy(() => import("./pages/Search"));
const DateRoulette = lazy(() => import("./pages/DateRoulette"));
const DailyQuestion = lazy(() => import("./pages/DailyQuestion"));
const Stats = lazy(() => import("./pages/Stats"));
const ShareCard = lazy(() => import("./pages/ShareCard"));
const DateExpenses = lazy(() => import("./pages/DateExpenses"));
const TimeCapsule = lazy(() => import("./pages/TimeCapsule"));
const CoupleChallenge = lazy(() => import("./pages/CoupleChallenge"));
const AnniversaryAdd = lazy(() => import("./pages/AnniversaryAdd"));
const Help = lazy(() => import("./pages/Help"));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--app-bg)" }}>
      <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: "rgb(var(--accent-030))", borderTopColor: "rgb(var(--accent-070))" }} />
    </div>
  );
}

function App() {
  useEffect(() => {
    const unsubscribe = initAuthListener();
    return unsubscribe;
  }, []);

  return (
    <ErrorBoundary>
    <ThemeProvider>
      <Toaster position="top-center" containerClassName="mt-12" />
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Login />} />

            <Route element={<AuthGuard />}>
              <Route path="/onboarding" element={<Onboarding />} />

              <Route element={<MainLayout />}>
                <Route path="/today" element={<Today />} />
                <Route path="/travel" element={<Travel />} />
                <Route path="/compose" element={<Compose />} />
                <Route path="/timeline" element={<Timeline />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/add/country" element={<CountrySelect />} />
                <Route path="/add/region/:countryId" element={<RegionSelect />} />
                <Route path="/add/search/:regionId" element={<PlaceSearchPage />} />
                <Route path="/add/form" element={<PinForm />} />
                <Route path="/memory/:id" element={<MemoryDetail />} />
                <Route path="/region/:regionId" element={<RegionDetail />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/location" element={<LocationShare />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/stickers" element={<Stickers />} />
                <Route path="/travelogue" element={<Travelogue />} />
                <Route path="/print" element={<Print />} />
                <Route path="/voice" element={<VoiceMemo />} />
                <Route path="/search" element={<Search />} />
                <Route path="/roulette" element={<DateRoulette />} />
                <Route path="/daily-question" element={<DailyQuestion />} />
                <Route path="/stats" element={<Stats />} />
                <Route path="/share-card" element={<ShareCard />} />
                <Route path="/expenses" element={<DateExpenses />} />
                <Route path="/time-capsule" element={<TimeCapsule />} />
                <Route path="/challenge" element={<CoupleChallenge />} />
                <Route path="/anniversary/add" element={<AnniversaryAdd />} />
                <Route path="/help" element={<Help />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
