import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import SetPassword from "./pages/SetPassword"
import ListingDetails from "./pages/ListingDetails";
import NotFound from "./pages/NotFound";
import { AdminLayout } from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminListings from "./pages/admin/AdminListings";
import AdminStatistics from "./pages/admin/AdminStatistics";
import AdminArchive from "./pages/admin/AdminArchive";
import AdminHistory from "./pages/admin/AdminHistory";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminScrapers from "./pages/admin/AdminScrapers"
import { EditorLayout } from "./components/editor/EditorLayout";
import EditorDashboard from "./pages/editor/EditorDashboard";
import EditorScrapers from "./pages/editor/EditorScrapers";
import EditorProfile from "./pages/editor/EditorProfile";
import SubscriberProfile from "./pages/subscriber/SubscriberProfile";
import SubscriberFavorites from "./pages/subscriber/SubscriberFavorites";
import { Analytics } from "@vercel/analytics/react";
const queryClient = new QueryClient();

// Protected route - requires authentication
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Admin route - requires admin role
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Editor route - requires editor role (not admin)
const EditorRoute = ({ children }: { children: React.ReactNode }) => {
  const { isEditor, isAdmin, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Only allow editors, not admins (they have their own panel)
  if (!isEditor || isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Editor route - requires editor role (not admin)
const SubscriberRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSubscriber, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Only allow editors, not admins (they have their own panel)
  if (!isSubscriber) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const SubscriberOrEditorRoute = ({ children }: { children: React.ReactNode }) => {
  const {
    isSubscriber,
    isEditor,
    isAuthenticated,
    loading
  } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isSubscriber && !isEditor) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Public route - redirect if already authenticated
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Analytics />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              }
            />
            <Route
              path="/set-password"
              element={
                <PublicRoute>
                  <SetPassword />
                </PublicRoute>
              }
            />

            {/* Protected routes - all users must be logged in */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/details/:id"
              element={
                <ProtectedRoute>
                  <ListingDetails />
                </ProtectedRoute>
              }
            />

            {/* Subscriber routes */}
            <Route
              path="/profile"
              element={
                <SubscriberRoute>
                  <SubscriberProfile />
                </SubscriberRoute>
              }
            />
            <Route
              path="/favorites"
              element={
                <SubscriberOrEditorRoute>
                  <SubscriberFavorites />
                </SubscriberOrEditorRoute>
              }
            />

            {/* Editor Routes */}
            <Route
              path="/editor"
              element={
                <EditorRoute>
                  <EditorLayout />
                </EditorRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="archive" element={<AdminArchive />} />
              {/* <Route path="listings" element={<EditorListings />} /> */}
              {/* <Route path="statistics" element={<EditorStatistics />} /> */}
              <Route path="profile" element={<EditorProfile />} />
              <Route path="scrapers" element={<EditorScrapers />} />
            </Route>

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              {/* <Route path="listings" element={<AdminListings />} /> */}
              <Route path="archive" element={<AdminArchive />} />
              {/* <Route path="history" element={<AdminHistory />} /> */}
              {/* <Route path="statistics" element={<AdminStatistics />} /> */}
              <Route path="profile" element={<AdminProfile />} />
              <Route path="scrapers" element={<AdminScrapers />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
