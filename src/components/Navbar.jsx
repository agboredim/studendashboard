import { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  Phone,
  User,
  Layout,
  SquareMenu,
  LogIn,
  UserPlus,
  Rocket,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import logoImage from "@/assets/img/logo.jpeg"; // Import the image

// Constants
const menuLinks = [
  { title: "Home", href: "/" },
  { title: "About Us", href: "/about" },
  { title: "Partner with Us", href: "/partner" },
  { title: "Get Started", href: "/courses" },
];

const lgScreenLinks = [
  { title: "Services", href: "/services" },
  { title: "Courses", href: "/courses" },
  { title: "Student Portal", href: "/portal" },
  { title: "Blog", href: "/blog" },
  { title: "Our Story", href: "/story" },
  { title: "Contact Us", href: "/contact" },
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
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get user from Redux store
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = useCallback(() => setIsMenuOpen((prev) => !prev), []);
  const toggleProfile = useCallback(
    () => setIsProfileOpen((prev) => !prev),
    []
  );

  const handleLogout = () => {
    if (user) {
      try {
        // Dispatch the local logout action
        dispatch(logout());
        // toast.success("Logged out successfully");
        navigate("/");
        setIsProfileOpen(false);
      } catch (error) {
        toast.error("Logout failed. Please try again.");
      }
    }
  };

  // Profile options based on authentication status
  const profileOptions = user
    ? [
        { title: "My Profile", href: "/profile", icon: User },
        { title: "Student Portal", href: "/portal", icon: Layout },
        { title: "Logout", action: handleLogout, icon: LogOut },
      ]
    : [
        { title: "Login", href: "/login", icon: LogIn },
        { title: "Sign Up", href: "/signup", icon: UserPlus },
        { title: "Get Started", href: "/courses", icon: Rocket },
      ];

  return (
    <header className="sticky top-0 z-50 w-full shadow-sm backdrop-blur bg-opacit">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left side - Logo and Menu */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center" aria-label="Home">
              <div className="flex items-center">
                <img
                  src={logoImage}
                  alt="Logo"
                  className="w-48 rounded-md"
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
                    className="text-primary hover:text-secondary transition-colors duration-300"
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
                    className="flex items-center gap-2 cursor-pointer text-foreground hover:bg-gray-50 hover:text-secondary lg:hover:bg-gray-50 lg:hover:text-secondary transition-colors duration-300"
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
                    <div className="border-t border-foreground/10 my-2"></div>
                    {lgScreenLinks.map((option) => (
                      <DropdownMenuItem
                        key={option.href}
                        className="flex items-center gap-2 cursor-pointer text-foreground hover:bg-gray-50 hover:text-secondary transition-colors duration-300"
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
            <div className="relative w-60">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/60 hover:text-secondary transition-colors duration-300" />
              <input
                type="search"
                placeholder="Search"
                className="h-10 w-full rounded-md bg-gray-100 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Search website"
              />
            </div>
            {!lgScreenLinks.find((link) => link.title === "Contact Us") && (
              <Button variant="ghost" size="icon" aria-label="Callus">
                <Phone className="h-5 w-5 text-primary hover:text-secondary transition-colors duration-300" />
              </Button>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-6">
            {lgScreenLinks.map((link) => (
              <Link
                key={link.title}
                to={link.href}
                className="text-sm font-medium text-foreground hover:text-secondary focus:text-secondary transition-colors duration-300"
              >
                {link.title}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            {isMobile && (
              <Button variant="ghost" size="icon" aria-label="Call us">
                <Phone className="h-5 w-5 text-primary hover:text-secondary transition-colors duration-300" />
              </Button>
            )}

            <DropdownMenu open={isProfileOpen} onOpenChange={setIsProfileOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative flex items-center gap-1"
                  aria-label="User menu"
                  aria-expanded={isProfileOpen}
                >
                  <User className="h-5 w-5 text-primary hover:text-secondary transition-colors duration-300" />
                  <span className="flex items-center justify-center text-xs text-primary hover:text-secondary transition-colors duration-300">
                    ▼
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-white border-0 shadow-2xl"
              >
                {user && (
                  <div className="px-4 py-3 border-b border-foreground/10">
                    <p className="text-sm font-medium text-primary">Welcome,</p>
                    <p className="text-sm text-foreground truncate">
                      {user.username || user.email}
                    </p>
                  </div>
                )}

                {profileOptions.map((option, index) => (
                  <DropdownMenuItem
                    key={index}
                    className="flex items-center gap-2 text-foreground hover:bg-gray-50 hover:text-secondary transition-colors duration-300 lg:hover:bg-gray-50 lg:hover:text-secondary"
                    onClick={option.action ? option.action : undefined}
                    asChild={!option.action}
                  >
                    {option.action ? (
                      <div className="flex items-center gap-2 cursor-pointer">
                        <option.icon className="h-4 w-4 text-foreground" />
                        <span>{option.title}</span>
                      </div>
                    ) : (
                      <Link
                        to={option.href}
                        className="flex items-center gap-2"
                      >
                        <option.icon className="h-4 w-4 text-foreground" />
                        <span>{option.title}</span>
                      </Link>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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
                className="px-4 py-2 text-sm text-primary hover:bg-gray-100 hover:text-secondary transition-colors duration-300"
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
