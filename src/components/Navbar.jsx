import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Search,
  Phone,
  User,
  Menu,
  Grid,
  Layout,
  SquareMenu,
  LogIn,
  UserPlus,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logoVideo from "@/assets/img/icon1.mp4";

// Constants
const menuLinks = [
  { title: "Home", href: "/team" },
  { title: "About Us", href: "/about" },
  { title: "Our Story", href: "/story" },
  { title: "Partner with Us", href: "/press" },
  { title: "Get Started", href: "/projects" },
];

const lgScreenLinks = [
  { title: "Courses", href: "/get-started" },
  { title: "Student Portal", href: "/portal" },
  { title: "Blog", href: "/blog" },
  { title: "Projects", href: "/project" },
  { title: "Contact Us", href: "/contact" },
];

const profileOptions = [
  { title: "Login", href: "/login", icon: LogIn },
  { title: "Sign Up", href: "/signup", icon: UserPlus },
  { title: "Get Started", href: "/courses", icon: Rocket },
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
                <video
                  src={logoVideo}
                  className="w-48 rounded-md"
                  autoPlay
                  loop
                  muted
                  aria-label="Logo"
                />
              </div>
            </Link>
          </div>

          {/* Menu Button (Always Visible) */}
          <div className="">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="relative flex items-center justify-center"
                  aria-label="User menu"
                  aria-expanded={isMenuOpen}
                >
                  <SquareMenu
                    size={24}
                    className="text-blue-950 hover:text-[#FDBC00] transition-colors duration-300"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-white border-0 shadow-2xl"
              >
                {/* Always show menuLinks */}
                {menuLinks.map((option) => (
                  <DropdownMenuItem
                    key={option.href}
                    className="flex items-center gap-2 cursor-pointer text-blue-950 hover:bg-gray-50 hover:text-[#FDBC00] transition-colors duration-300"
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
                    <div className="border-t border-gray-200 my-2"></div>
                    {lgScreenLinks.map((option) => (
                      <DropdownMenuItem
                        key={option.href}
                        className="flex items-center gap-2 cursor-pointer text-blue-950 hover:bg-gray-50 hover:text-[#FDBC00] transition-colors duration-300"
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
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 hover:text-[#FDBC00] transition-colors duration-300" />
              <input
                type="search"
                placeholder="Search"
                className="h-10 w-full rounded-md bg-gray-100 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-950"
                aria-label="Search website"
              />
            </div>
            {!lgScreenLinks.find((link) => link.title === "Contact Us") && (
              <Button variant="ghost" size="icon" aria-label="Callus">
                <Phone className="h-5 w-5 text-blue-950 hover:text-[#FDBC00] transition-colors duration-300" />
              </Button>
            )}
          </div>

          {/* Phone Icon for Small Screens */}
          {isMobile && (
            <div className="flex items-center gap-4 lg:hidden">
              <Button variant="ghost" size="icon" aria-label="Call us">
                <Phone className="h-5 w-5 text-blue-950 hover:text-[#FDBC00] transition-colors duration-300" />
              </Button>
            </div>
          )}

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-6">
            {lgScreenLinks.map((link) => (
              <Link
                key={link.title}
                to={link.href}
                className="text-sm font-medium text-blue-950 hover:text-[#FDBC00] focus:text-[#FDBC00] transition-colors duration-300"
              >
                {link.title}
              </Link>
            ))}

            <div className="flex items-center gap-4">
              {isMobile && (
                <Button variant="ghost" size="icon" aria-label="Call us">
                  <Phone className="h-5 w-5 text-blue-950 hover:text-[#FDBC00] transition-colors duration-300" />
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
                    className="relative flex items-center gap-1"
                    aria-label="User menu"
                    aria-expanded={isProfileOpen}
                  >
                    <User className="h-5 w-5 text-blue-950 hover:text-[#FDBC00] transition-colors duration-300" />
                    <span className="flex items-center justify-center text-xs text-blue-950 hover:text-[#FDBC00] transition-colors duration-300">
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
                      className="flex items-center gap-2 "
                      asChild
                    >
                      <Link to={option.href}>
                        <option.icon className="h-4 w-4 text-blue-950" />
                        <span className="text-blue-950 hover:bg-gray-50 hover:text-[#FDBC00] transition-colors duration-300">
                          {option.title}
                        </span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
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
                className="px-4 py-2 text-sm text-blue-950 hover:bg-gray-100 hover:text-[#FDBC00] transition-colors duration-300"
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
