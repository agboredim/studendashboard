import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function HeaderNav({ onMenuClick, showMenuButton = false }) {
  const location = useLocation(); // Correct usage of useLocation

  return (
    <header className="bg-blue-900 text-white shadow z-10">
      <div className="flex items-center justify-between px-4 py-3">
        {showMenuButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="md:hidden text-white"
          >
            <Menu className="h-6 w-6" />
          </Button>
        )}

        <div className="hidden md:flex space-x-4">
          <NavItem href="/" active={location.pathname === "/"}>
            Home
          </NavItem>
          <NavItem href="/courses" active={location.pathname === "/courses"}>
            My Courses
          </NavItem>
          <NavItem
            href="/certificate"
            active={location.pathname === "/certificate"}
          >
            Certificate
          </NavItem>
          <NavItem href="/support" active={location.pathname === "/support"}>
            Support
          </NavItem>
        </div>

        <div className="flex items-center gap-4">
          <Button className="bg-blue-700 hover:bg-blue-600 text-white rounded-full font-medium">
            JOIN LIVE CLASS
          </Button>

          <Avatar className="h-10 w-10 border-2 border-white">
            <AvatarImage src="" alt="User" />
            <AvatarFallback className="bg-blue-500 text-white">
              J
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}

function NavItem({ href, active, children }) {
  return (
    <Link to={href}>
      <span
        className={cn(
          "px-4 py-2 text-sm font-medium transition-colors rounded-full cursor-pointer inline-block",
          active ? "bg-blue-700 text-white" : "text-white hover:bg-blue-800"
        )}
      >
        {children}
      </span>
    </Link>
  );
}
