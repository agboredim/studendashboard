"use client";

import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  BookIcon,
  BarChart3Icon,
  AwardIcon,
  BellIcon,
  GraduationCapIcon,
  VideoIcon,
  UsersIcon,
  LogOutIcon,
  UserIcon,
  Settings,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLogoutMutation } from "@/services/api";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { FolderKanban } from "lucide-react";

// NavSection component for grouping navigation items
function NavSection({ title, children }) {
  return (
    <div className="space-y-1">
      {title && (
        <h3 className="px-4 text-xs font-semibold text-primary/70 uppercase tracking-wider">
          {title}
        </h3>
      )}
      <div className="space-y-1">{children}</div>
    </div>
  );
}

// NavItem component for individual navigation links
function NavItem({ href, active, icon, children, onClick, badge }) {
  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <Link
      to={href}
      onClick={handleClick}
      className={cn(
        "flex items-center px-4 py-2.5 text-sidebar rounded-md transition-colors !no-scrollbar",
        active
          ? "bg-primary/10 text-primary font-medium"
          : "hover:bg-primary/5 text-primary/90"
      )}
    >
      <span className="mr-3 text-primary/80">{icon}</span>
      <span>{children}</span>
      {badge && (
        <Badge variant="secondary" className="ml-auto">
          {badge}
        </Badge>
      )}
    </Link>
  );
}

export default function SidebarNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [logout] = useLogoutMutation();
  const { user } = useSelector((state) => state.auth);

  // Mock notification count - replace with actual data
  const notificationCount = 3;

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      navigate("/login");
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getInitials = (name) => {
    if (!name) return "ST";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <aside className="w-64 z-50 flex-shrink-0 h-full fixed bg-foreground text-primary flex flex-col !no-scrollbar">
      {/* Header with logo */}
      <div className="p-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
          <GraduationCapIcon className="h-4 w-4 text-primary-foreground" />
        </div>
        <div className="font-semibold tracking-tight">STUDENT PORTAL</div>
      </div>

      <Separator className="bg-primary/10" />

      {/* User profile section */}
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-9 w-9 border border-primary/20">
            <AvatarImage
              src={user?.avatar || "/placeholder.svg"}
              alt={user?.username || "User"}
            />
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(user?.username)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {user?.username || "Student"}
            </span>
            <span className="text-xs text-primary/70">
              {user?.email || "student@example.com"}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation sections */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-6 no-scrollbar">
        <NavSection>
          <NavItem
            href="/portal"
            active={location.pathname === "/portal"}
            icon={<HomeIcon className="h-5 w-5" />}
          >
            Dashboard
          </NavItem>
        </NavSection>

        <NavSection title="Learning">
          <NavItem
            href="/portal/courses"
            active={location.pathname.includes("/portal/courses")}
            icon={<GraduationCapIcon className="h-5 w-5" />}
          >
            My Courses
          </NavItem>

          <NavItem
            href="/portal/library"
            active={location.pathname === "/portal/library"}
            icon={<BookIcon className="h-5 w-5" />}
          >
            Course Library
          </NavItem>
          <NavItem
            href="/portal/assignments"
            active={location.pathname === "/portal/assignments"}
            // active={location.pathname === "/portal/library"}
            icon={<FolderKanban className="h-5 w-5" />}
          >
            Assignments
          </NavItem>

          <NavItem
            href="/portal/live-classes"
            // href=""
            active={location.pathname.includes("/portal/live-classes")}
            icon={<VideoIcon className="h-5 w-5" />}
          >
            Live Classes
          </NavItem>
        </NavSection>

        <NavSection title="Performance">
          <NavItem
            href="/portal/progress"
            active={location.pathname.includes("/portal/progress")}
            icon={<BarChart3Icon className="h-5 w-5" />}
          >
            Progress & Analytics
          </NavItem>

          <NavItem
            href="/portal/certificates"
            active={location.pathname.includes("/portal/certificates")}
            icon={<AwardIcon className="h-5 w-5" />}
          >
            Certificates
          </NavItem>
        </NavSection>

        <NavSection title="Communication">
          <NavItem
            href="/portal/chat"
            active={location.pathname.includes("/portal/teams")}
            icon={<UsersIcon className="h-5 w-5" />}
          >
            Teams Chat
          </NavItem>

          <NavItem
            href="/portal/notifications"
            // href=""
            active={location.pathname.includes("/portal/notifications")}
            icon={<BellIcon className="h-5 w-5" />}
            badge={notificationCount}
          >
            Notifications
          </NavItem>
        </NavSection>

        <NavSection title="Account">
          <NavItem
            href="/portal/profile"
            active={location.pathname.includes("/portal/profile")}
            icon={<UserIcon className="h-5 w-5" />}
          >
            Profile
          </NavItem>

          {/* <NavItem
            href="/portal/settings"
            active={location.pathname.includes("/portal/settings")}
            icon={<Settings className="h-5 w-5" />}
          >
            Settings
          </NavItem> */}

          <NavItem
            href="#"
            onClick={handleLogout}
            icon={<LogOutIcon className="h-5 w-5" />}
          >
            Logout
          </NavItem>
        </NavSection>
      </nav>
    </aside>
  );
}
