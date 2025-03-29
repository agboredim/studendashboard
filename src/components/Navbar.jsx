import { useState, useEffect, useRef, useCallback, memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Phone, MapPin, User, Menu, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Constants
const menuLinks = [
  { title: "About Us", href: "/about" },
  { title: "Meet the Team", href: "/team" },
  { title: "Our Story", href: "/story" },
  { title: "In the Press", href: "/press" },
  { title: "Our Projects", href: "/projects" },
  { title: "Support", href: "/support" },
];

const lgScreenLinks = [
  { title: "Our Framework", href: "/framework" },
  { title: "Accreditation", href: "/accreditation" },
  { title: "DBT Awards", href: "/awards" },
  { title: "Success Stories", href: "/success-stories" },
  { title: "Contact Us", href: "/contact" },
];

const profileOptions = [
  { title: "Login", href: "/login", icon: User },
  { title: "Sign Up", href: "/signup", icon: User },
  { title: "Get started", href: "/get-started", icon: User },
];

function useResponsive() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { isMobile };
}

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isMobile } = useResponsive();
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = useCallback(() => setIsMenuOpen((prev) => !prev), []);
  const toggleProfile = useCallback(
    () => setIsProfileOpen((prev) => !prev),
    []
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left side - Logo and Menu */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center" aria-label="Home">
              <div className="flex items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white">
                  <span className="font-bold bg-blue-500">PT</span>
                </div>
                <span className="bg-secondary ml-2 w-full text-lg font-semibold">
                  Pro-Trainer
                </span>
              </div>
            </Link>
            {/* Menu Button (Always Visible) */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:block"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>

          {/* Search and Icons */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Search"
                className="h-10 rounded-md bg-gray-100 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                aria-label="Search website"
              />
            </div>
            <Button variant="ghost" size="icon" aria-label="Location">
              <MapPin className="h-5 w-5" />
            </Button>
            {!lgScreenLinks.find((link) => link.title === "Contact Us") && (
              <Button variant="ghost" size="icon" aria-label="Call us">
                <Phone className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-6">
            {lgScreenLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-medium text-gray-700 hover:text-orange-500"
              >
                {link.title}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Dropdown Menu (Now smaller size) */}
      {isMenuOpen && (
        <div
          className="absolute left-0 top-16 z-50 w-64 bg-white shadow-lg"
          role="menu"
        >
          <nav className="flex flex-col py-2">
            {menuLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.title}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
