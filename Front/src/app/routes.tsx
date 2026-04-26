import { createBrowserRouter } from "react-router";
import { Layout } from "../components/Layout";
import { RequireRole } from "../components/RequireRole";
import { HomePage } from "../pages/HomePage";
import { StudiosPage } from "../pages/StudiosPage";
import { StudioDetailPage } from "../pages/StudioDetailPage";
import { BookingPage } from "../pages/BookingPage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { BookingsListPage } from "../pages/BookingsListPage";
import { ProfilePage } from "../pages/ProfilePage";
import { AdminPage } from "../pages/AdminPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: "studios", Component: StudiosPage },
      { path: "studios/:id", Component: StudioDetailPage },
      { path: "login", Component: LoginPage },
      { path: "register", Component: RegisterPage },
      {
        path: "booking",
        element: (
          <RequireRole roles={["Client"]}>
            <BookingPage />
          </RequireRole>
        ),
      },
      {
        path: "bookings",
        element: (
          <RequireRole roles={["Client", "Owner", "Superadmin"]}>
            <BookingsListPage />
          </RequireRole>
        ),
      },
      {
        path: "profile",
        element: (
          <RequireRole>
            <ProfilePage />
          </RequireRole>
        ),
      },
      {
        path: "admin",
        element: (
          <RequireRole roles={["Owner", "Superadmin"]}>
            <AdminPage />
          </RequireRole>
        ),
      },
    ],
  },
]);
