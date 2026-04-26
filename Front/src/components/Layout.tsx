import { Outlet } from "react-router";
import { Navbar } from "./Navbar";

export function Layout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          &copy; 2026 SoundSpace. Усі права захищено.
        </div>
      </footer>
    </div>
  );
}
