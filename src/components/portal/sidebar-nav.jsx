import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  HomeIcon,
  BookIcon,
  BarChart3Icon,
  ClipboardCheckIcon,
  MessageSquareIcon,
  AwardIcon,
  BellIcon,
  GraduationCapIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLogoutMutation } from "@/services/api";

function NavItem({ href, active, icon, children, onClick }) {
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
        "flex items-center px-4 py-3 text-sidebar rounded-md transition-colors",
        active ? "bg-primary font-medium" : "hover:bg-primary"
      )}
    >
      <span className="mr-3">{icon}</span>
      <span>{children}</span>
    </Link>
  );
}

export default function SidebarNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [logout] = useLogoutMutation();

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

  return (
    <aside className="w-64 z-50 flex-shrink-0 h-full fixed bg-foreground text-primary flex flex-col">
      <div className="p-4">
        <h1 className="text-xl font-bold">STUDENT PORTAL</h1>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        <NavItem
          href="/portal"
          active={location.pathname === "/portal"}
          icon={<HomeIcon className="h-5 w-5" />}
        >
          Dashboard
        </NavItem>

        <NavItem
          href="/portal/library"
          active={location.pathname === "/portal/library"}
          icon={<BookIcon className="h-5 w-5" />}
        >
          Course Library
        </NavItem>

        <NavItem
          href="/portal/courses"
          active={location.pathname === "portal/courses"}
          icon={<GraduationCapIcon className="h-5 w-5" />}
        >
          My Courses
        </NavItem>

        <NavItem
          href="/progress"
          active={location.pathname === "/progress"}
          icon={<BarChart3Icon className="h-5 w-5" />}
        >
          My Progress
        </NavItem>

        <NavItem
          href="/assessments"
          active={location.pathname === "/assessments"}
          icon={<ClipboardCheckIcon className="h-5 w-5" />}
        >
          Assessments
        </NavItem>

        <NavItem
          href="/discussion"
          active={location.pathname === "/discussion"}
          icon={<MessageSquareIcon className="h-5 w-5" />}
        >
          Discussion
        </NavItem>

        <NavItem
          href="/certificate"
          active={location.pathname === "/certificate"}
          icon={<AwardIcon className="h-5 w-5" />}
        >
          Certificate
        </NavItem>

        <NavItem
          href="/notifications"
          active={location.pathname === "/notifications"}
          icon={<BellIcon className="h-5 w-5" />}
        >
          Notification
        </NavItem>
      </nav>
    </aside>
  );
}
