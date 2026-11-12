import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Resource Pages
import { ExplorePage } from './pages/resources/ExplorePage';
import { ShareResourcePage } from './pages/resources/ShareResourcePage';

// Dashboard Pages
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { MyListingsPage } from './pages/listings/MyListingsPage';
import { MyRequestsPage } from './pages/requests/MyRequestsPage';
import { TransactionsPage } from './pages/dashboard/TransactionsPage';
import { ProfilePage } from './pages/profile/ProfilePage';

// Community Pages
import { LeaderboardPage } from './pages/community/LeaderboardPage';
import { CommunityPage } from './pages/community/CommunityPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            border: '2px solid #121411',
            boxShadow: '3px 3px 0px #121411',
            borderRadius: '5px',
            background: '#ffffff',
            color: '#121411',
            fontWeight: 700,
            fontSize: '13px',
            fontFamily: '"Hanken Grotesk", sans-serif'
          },
          success: {
            iconTheme: {
              primary: '#121411',
              secondary: '#DDF247',
            },
          },
          error: {
            style: {
              background: '#FF5A36',
              color: '#ffffff',
            },
            iconTheme: {
              primary: '#ffffff',
              secondary: '#FF5A36',
            },
          },
        }}
      />

      <Routes>
        {/* Standalone Landing & Auth */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Public Browsing & Community with PublicLayout */}
        <Route element={<PublicLayout />}>
          <Route path="/resources" element={<ExplorePage />} />
          <Route path="/resources/share" element={<ShareResourcePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/community" element={<CommunityPage />} />
        </Route>

        {/* Protected User Dashboard Pages with Sidebar */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="listings" element={<MyListingsPage />} />
          <Route path="requests" element={<MyRequestsPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
