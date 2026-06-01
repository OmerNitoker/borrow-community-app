import { Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PublicRoute from "./components/PublicRoute.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import CommunityPage from "./pages/CommunityPage.jsx";
import HomeRedirect from "./pages/HomeRedirect.jsx";
import ItemDetailsPage from "./pages/ItemDetailsPage.jsx";
import ItemFormPage from "./pages/ItemFormPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";
import PendingApprovalPage from "./pages/PendingApprovalPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

function App() {
  return (
    <>
      <ScrollToTop />
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
            <Route path="/communities/:communityId/items/new" element={<ItemFormPage mode="create" />} />
            <Route path="/communities/:communityId/items/:itemId" element={<ItemDetailsPage />} />
            <Route path="/communities/:communityId/items/:itemId/edit" element={<ItemFormPage mode="edit" />} />
            <Route path="/communities/:communityId/admin" element={<AdminDashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
