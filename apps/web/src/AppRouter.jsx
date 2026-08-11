/**
 * SalesPilot AI — Application Router
 *
 * FIXES:
 * - Replaced hash-based routing with React Router DOM BrowserRouter
 * - Added ProtectedRoute component that checks auth state
 * - Added proper redirects for unauthenticated users
 * - Added /login route
 * - Mobile/desktop detection preserved but integrated properly
 */
import React, { lazy, Suspense } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { isAuthenticated } from './api/apiClient';

import { CRMProvider } from './context/CRMContext';

// Lazy-loaded pages for code splitting
const LandingPage = lazy(() => import('./pages/landing/LandingPage'));
const FeaturesPage = lazy(() => import('./pages/FeaturesPage'));
const FeatureDetail = lazy(() => import('./pages/FeatureDetail'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const AutomationPage = lazy(() => import('./pages/AutomationPage'));
const DesktopOS = lazy(() => import('./os/Desktop'));
const MobileOS = lazy(() => import('./mobile/MobileOS'));
const BrandBook = lazy(() => import('./pages/BrandBook'));
const LoginPage = lazy(() => import('./pages/Login'));
const RegisterPage = lazy(() => import('./pages/Register'));
const DemoPage = lazy(() => import('./pages/DemoPage'));

// ── Protected Route Guard ────────────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    // Preserve the intended destination for post-login redirect
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

// ── Responsive OS Wrapper ────────────────────────────────────────────────────
const ResponsiveOS = () => {
  const isMobile = window.innerWidth < 768;
  return isMobile ? <MobileOS /> : <DesktopOS />;
};

// ── Loading Fallback ─────────────────────────────────────────────────────────
const LoadingFallback = () => (
  <div className="flex h-screen items-center justify-center bg-gray-950">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
      <p className="text-white text-sm font-medium">Loading SalesPilot AI...</p>
    </div>
  </div>
);

// ── Main Router ──────────────────────────────────────────────────────────────
export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/features/:featureId" element={<FeatureDetail />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/automation" element={<AutomationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/brand" element={<BrandBook />} />

          {/* Protected App Route */}
          <Route
            path="/app/*"
            element={
              <ProtectedRoute>
                <CRMProvider>
                  <ResponsiveOS />
                </CRMProvider>
              </ProtectedRoute>
            }
          />

          {/* Catch-all: redirect unknown routes to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
