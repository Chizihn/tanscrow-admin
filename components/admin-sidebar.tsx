"use client";

import {
  LayoutDashboard,
  Users,
  FileText,
  AlertTriangle,
  Settings,
  LogOut,
  CreditCard,
  Bell,
  FileBarChart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ModeToggle } from "./mode-toggle";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";

interface MenuItem {
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
}

const mainMenuItems: MenuItem[] = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/users", icon: Users, label: "Users" },
  { href: "/transactions", icon: FileText, label: "Transactions" },
  { href: "/disputes", icon: AlertTriangle, label: "Disputes" },
  { href: "/withdrawals", icon: CreditCard, label: "Withdrawals" },
  { href: "/reports", icon: FileBarChart, label: "Reports" },
  { href: "/notifications", icon: Bell, label: "Notifications" },
];

const systemMenuItems: MenuItem[] = [
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`bg-card/50 backdrop-blur-sm border-r border-border flex flex-col h-full transition-all duration-300 ease-in-out shadow-sm ${
        isCollapsed ? "w-20" : "w-72"
      }`}
    >
      {/* Header - Fixed */}
      <div className="flex items-center justify-between p-6 border-b border-border/50 flex-shrink-0">
        <div className="flex items-center space-x-3">
          {!isCollapsed && (
            <span className="text-lg font-semibold tracking-tight text-foreground/90">
              Tanscrow Admin
            </span>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-accent/80 hover:text-accent-foreground transition-colors"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {/* Main Section */}
        <div className="py-4">
          {!isCollapsed && (
            <div className="px-4 mb-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Main
              </h3>
            </div>
          )}
          <nav className="space-y-1 px-2">
            {mainMenuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors group ${
                    active
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon
                    size={18}
                    className={`flex-shrink-0 ${
                      active ? "text-accent-foreground" : ""
                    }`}
                  />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Separator */}
        <div className="mx-4 border-t border-border" />

        {/* System Section */}
        <div className="py-4">
          {!isCollapsed && (
            <div className="px-4 mb-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                System
              </h3>
            </div>
          )}
          <nav className="space-y-1 px-2">
            {systemMenuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors group ${
                    active
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon
                    size={18}
                    className={`flex-shrink-0 ${
                      active ? "text-accent-foreground" : ""
                    }`}
                  />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer - Fixed */}
      <div className="p-4 border-t border-border flex-shrink-0">
        <div className="flex items-center justify-between">
          <button
            onClick={handleLogout}
            className={`flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors ${
              isCollapsed ? "justify-center" : ""
            }`}
            title={isCollapsed ? "Logout" : undefined}
          >
            <LogOut size={16} />
            {!isCollapsed && <span>Logout</span>}
          </button>
          {!isCollapsed && <ModeToggle />}
        </div>
      </div>
    </div>
  );
}
