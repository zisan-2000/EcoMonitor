"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Sun,
  Moon,
  Home,
  CloudRain,
  Droplet,
  Activity,
  FileText,
  AlertTriangle,
  Settings,
  LogOut,
  Users,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getUser, getUserPermissions, signOut } from "@/lib/auth";
import { Toaster } from "@/components/ui/toaster";

export default function DashboardLayout({ children }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [user, setUser] = useState<any>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    const currentUser = getUser();
    setUser(currentUser);
    setPermissions(getUserPermissions());

    return () => clearInterval(timer);
  }, [pathname]);

  if (!mounted) return null;

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(currentTime);

  const formattedTime = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(currentTime);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const getActiveTab = () => {
    if (pathname.includes("weather")) return "weather";
    if (pathname.includes("water")) return "water";
    if (pathname.includes("logs")) return "logs";
    if (pathname.includes("reports")) return "reports";
    if (pathname.includes("users")) return "users";
    if (pathname.includes("settings")) return "settings";
    return "dashboard";
  };

  const activeTab = getActiveTab();

  const handleMenuClick = (tab) => {
    switch (tab) {
      case "dashboard":
        router.push("/dashboard");
        break;
      case "weather":
        router.push("/dashboard/weather");
        break;
      case "water":
        router.push("/dashboard/water");
        break;
      case "logs":
        router.push("/dashboard/logs");
        break;
      case "reports":
        router.push("/dashboard/reports");
        break;
      case "users":
        router.push("/dashboard/users");
        break;
      case "settings":
        router.push("/dashboard/settings");
        break;
      default:
        router.push("/dashboard");
    }
  };

  const canAccess = (permission: string) => {
    if (user?.role === "super_admin") return true;
    return permissions.includes(permission);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <Sidebar className="h-full border-r">
          <SidebarHeader className="flex items-center justify-center py-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2"
            >
              <Activity className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold">EcoMonitor</h1>
            </motion.div>
          </SidebarHeader>

          <SidebarContent className="flex-1 overflow-y-auto">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "dashboard"}
                  onClick={() => handleMenuClick("dashboard")}
                >
                  <Home className="h-5 w-5" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {canAccess("weather") && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeTab === "weather"}
                    onClick={() => handleMenuClick("weather")}
                  >
                    <CloudRain className="h-5 w-5" />
                    <span>Weather Monitoring</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {canAccess("water") && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeTab === "water"}
                    onClick={() => handleMenuClick("water")}
                  >
                    <Droplet className="h-5 w-5" />
                    <span>Water Quality</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {canAccess("logs") && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeTab === "logs"}
                    onClick={() => handleMenuClick("logs")}
                  >
                    <AlertTriangle className="h-5 w-5" />
                    <span>System Logs</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {canAccess("reports") && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeTab === "reports"}
                    onClick={() => handleMenuClick("reports")}
                  >
                    <FileText className="h-5 w-5" />
                    <span>Reports</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {canAccess("settings") && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeTab === "settings"}
                    onClick={() => handleMenuClick("settings")}
                  >
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {canAccess("users") && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeTab === "users"}
                    onClick={() => handleMenuClick("users")}
                  >
                    <Users className="h-5 w-5" />
                    <span>User Management</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {user?.role === "super_admin" && (
                <div className="px-2 py-1 text-xs rounded bg-primary/10 text-primary flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  <span>Super Admin Access</span>
                </div>
              )}
              {user?.role === "admin" && (
                <div className="px-2 py-1 text-xs rounded bg-blue-500/10 text-blue-500 flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  <span>Admin Access</span>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="w-full justify-start"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-full items-center px-6 justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="md:hidden" />
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">{formattedDate}</span>
                  <span className="ml-2">{formattedTime}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>

                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6 bg-muted/10">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
