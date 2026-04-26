import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { StudiosPage } from "./pages/StudiosPage";
import { StudioDetailPage } from "./pages/StudioDetailPage";
import { BookingPage } from "./pages/BookingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { BookingsListPage } from "./pages/BookingsListPage";
import { ProfilePage } from "./pages/ProfilePage";
import { AdminPage } from "./pages/AdminPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: "studios", Component: StudiosPage },
      { path: "studios/:id", Component: StudioDetailPage },
      { path: "booking", Component: BookingPage },
      { path: "login", Component: LoginPage },
      { path: "register", Component: RegisterPage },
      { path: "bookings", Component: BookingsListPage },
      { path: "profile", Component: ProfilePage },
      { path: "admin", Component: AdminPage },
    ],
  },
]);
