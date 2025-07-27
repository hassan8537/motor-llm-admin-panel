// Updated App.tsx with route protection
import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import { ScrollToTop } from "./components/common/ScrollToTop";
import UserDashboard from "./pages/Dashboard/UserDashboard";
import UserLayout from "./layout/UserLayout";
import UserDetail from "./pages/UserDetail";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Logout from "./pages/Logout";
import UsersPage from "./pages/UserPage";
import UserFilesPage from "./pages/UserFilesPage";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes - Login pages */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <SignIn />
              </PublicRoute>
            }
          />
          <Route
            path="/signin"
            element={
              <PublicRoute>
                <SignIn />
              </PublicRoute>
            }
          />

          {/* Protected Routes - All dashboard and user management pages */}
          <Route
            element={
              <ProtectedRoute>
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/:userId/files" element={<UserFilesPage />} />
            <Route path="/users/:userId" element={<UserDetail />} />
            <Route path="/profile-admin" element={<Profile />} />
            <Route path="/settings-admin" element={<Settings />} />
            <Route path="/logout-admin" element={<Logout />} />
          </Route>

          {/* Fallback Route - Also protected */}
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <NotFound />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
}
