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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  aria-label="User menu"
                  aria-expanded={isMenuOpen}
                >
                  <Menu />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-white border-0 shadow-2xl"
              >
                {/* Always show menuLinks */}
                {menuLinks.map((option) => (
                  <DropdownMenuItem
                    key={option.href}
                    className="flex items-center gap-2 cursor-pointer"
                    asChild
                  >
                    <Link to={option.href}>
                      <span>{option.title}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}

                {/* Conditionally show lgScreenLinks on smaller screens */}
                {isMobile && (
                  <>
                    <div className="border-t border-gray-200 my-2"></div>{" "}
                    {/* Divider */}
                    {lgScreenLinks.map((option) => (
                      <DropdownMenuItem
                        key={option.href}
                        className="flex items-center gap-2 cursor-pointer"
                        asChild
                      >
                        <Link to={option.href}>
                          <span>{option.title}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
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
            {!lgScreenLinks.find((link) => link.title === "Contact Us") && (
              <Button variant="ghost" size="icon" aria-label="Call us">
                <Phone className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Phone Icon for Small Screens */}
          {isMobile && (
            <div className="flex items-center gap-4 lg:hidden">
              <Button variant="ghost" size="icon" aria-label="Call us">
                <Phone className="h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-4">
            {lgScreenLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-medium text-gray-700 hover:text-orange-500"
              >
                {link.title}
              </Link>
            ))}

            <div className="flex items-center gap-4">
              {isMobile && (
                <Button variant="ghost" size="icon" aria-label="Call us">
                  <Phone className="h-5 w-5" />
                </Button>
              )}

              <DropdownMenu
                open={isProfileOpen}
                onOpenChange={setIsProfileOpen}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    aria-label="User menu"
                    aria-expanded={isProfileOpen}
                  >
                    <User className="h-5 w-5" />
                    <span className="absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center rounded-full bg-orange-500 text-[8px] text-white">
                      ▼
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-white border-0 shadow-2xl"
                >
                  {profileOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.href}
                      className="flex items-center gap-2 cursor-pointer"
                      asChild
                    >
                      <Link to={option.href}>
                        <option.icon className="h-4 w-4 text-gray-500" />
                        <span>{option.title}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
