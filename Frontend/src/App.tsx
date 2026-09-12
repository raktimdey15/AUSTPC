import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import type { ReactNode } from "react";

import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home/home";
import About from "./pages/About/about";
import Events from "./pages/Events/events";
import Executive from "./pages/Executive/executive";
import SubExecutive from "./pages/SubExecutive/subExecutive";
import HallOfFame from "./pages/HallofFame/hallOfFame";
import UpcomingEventsPage from "./pages/UpcomingEvents/upcomingEvents";
import GalleryPage from "./pages/Gallery/Gallery";
import NoticePage from "./pages/Notice/notice";
import JoinPage from "./pages/Join/join";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminPage from "./pages/Admin/admin";
import AdminGallery from "./pages/Admin/AdminGallery";
import { useAuth } from "./context/AuthContext";

/**
 * Route guard for admin-only pages.
 * Uses the Supabase-backed AuthContext instead of sessionStorage.
 *
 * Shows nothing while the auth state is still loading (prevents flash redirects).
 * Redirects to /admin login if not authenticated or not an admin.
 */
function AdminRoute({ children }: { children: ReactNode }) {
  const { session, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[#00FF66]" />
      </div>
    );
  }

  if (!session || !isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "events", element: <Events /> },
      { path: "events/:slug", element: <Events /> },
      { path: "executive", element: <Executive /> },
      { path: "sub-executive", element: <SubExecutive /> },
      { path: "hall-of-fame", element: <HallOfFame /> },
      { path: "hall-of-fame/:slug", element: <HallOfFame /> },
      { path: "upcoming-events", element: <UpcomingEventsPage /> },
      { path: "notice", element: <NoticePage /> },
      { path: "gallery", element: <GalleryPage /> },
      { path: "join", element: <JoinPage /> },
      { path: "admin", element: <AdminLogin /> },
      {
        path: "admin/dashboard",
        element: (
          <AdminRoute>
            <AdminPage />
          </AdminRoute>
        ),
      },
      {
        path: "admin/gallery",
        element: (
          <AdminRoute>
            <AdminGallery />
          </AdminRoute>
        ),
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}