/**
 * Dashboard Layout
 * Protected layout with navigation and logout functionality
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, User, LogOut, Menu, X, Database } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { showSuccess } = useToast();
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Clear cookie
    document.cookie = "token=; path=/; max-age=0";

    // Show success message
    showSuccess("Logged out successfully");

    // Redirect to login
    router.push("/login");
  };

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      name: "Entities",
      href: "/dashboard/entities",
      icon: Database,
      active: pathname?.startsWith("/dashboard/entities"),
    },
    {
      name: "Profile",
      href: "/dashboard/profile",
      icon: User,
      active: pathname === "/dashboard/profile",
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-40" style={{ backgroundColor: 'var(--background)' }} aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-100 lg:hidden"
                style={{ color: 'var(--text-primary)' }}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" aria-hidden="true" />
                ) : (
                  <Menu className="w-6 h-6" aria-hidden="true" />
                )}
              </button>

              {/* Logo */}
              <div className="flex-shrink-0 flex items-center ml-2 lg:ml-0">
                <LayoutDashboard className="w-8 h-8" style={{ color: 'var(--text-primary)' }} aria-hidden="true" />
                <span className="ml-2 text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Primetrade.ai
                </span>
              </div>
            </div>

            {/* User info and logout */}
            <div className="flex items-center gap-4">
              {user && (
                <div className="hidden sm:block text-sm" style={{ color: 'var(--text-primary)' }} aria-label="Current user">
                  <span className="font-medium">{user.name}</span>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="hover:bg-gray-100"
                style={{ color: 'var(--text-primary)' }}
                aria-label="Logout from dashboard"
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div id="mobile-menu" className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1" role="menu">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    role="menuitem"
                    aria-current={item.active ? "page" : undefined}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      item.active
                        ? "bg-gray-100"
                        : "hover:bg-gray-50"
                    }`}
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 min-h-[calc(100vh-4rem)]" style={{ backgroundColor: 'var(--background)' }} aria-label="Sidebar navigation">
          <nav className="p-4 space-y-2" role="navigation">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-current={item.active ? "page" : undefined}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    item.active
                      ? "bg-gray-100"
                      : "hover:bg-gray-50"
                  }`}
                  style={{ color: 'var(--text-primary)' }}
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8" role="main">
          {children}
        </main>
      </div>
    </div>
  );
}
