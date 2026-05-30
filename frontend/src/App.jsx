import { Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PublicRoute from "./components/PublicRoute.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import CommunityPage from "./pages/CommunityPage.jsx";
import HomeRedirect from "./pages/HomeRedirect.jsx";
import ItemFormPlaceholderPage from "./pages/ItemFormPlaceholderPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";
import PendingApprovalPage from "./pages/PendingApprovalPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

function App() {
  return (
    <Routes>
      <Route
        path="/auth"
        element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<HomeRedirect />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/pending/:communityId" element={<PendingApprovalPage />} />
          <Route path="/communities/:communityId" element={<CommunityPage />} />
          <Route path="/communities/:communityId/items/new" element={<ItemFormPlaceholderPage />} />
          <Route path="/communities/:communityId/admin" element={<AdminDashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
