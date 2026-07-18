import { createBrowserRouter, RouterProvider } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home/home";
import About from "./pages/About/about";
import Events from "./pages/Events/events";
import Executive from "./pages/Executive/executive";
import SubExecutive from "./pages/SubExecutive/subExecutive";
import HallOfFame from "./pages/HallofFame/hallOfFame";
import UpcomingEventsPage from "./pages/UpcomingEvents/upcomingEvents";
import NoticePage from "./pages/Notice/notice";
import JoinPage from "./pages/Join/join";
import AdminPage from "./pages/Admin/admin";

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
      { path: "join", element: <JoinPage /> },
      { path: "admin", element: <AdminPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}