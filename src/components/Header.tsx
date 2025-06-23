import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const ADMIN_EMAIL = "myplayer4560@gmail.com"; // Your admin email

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const { data: isAdminFromHook } = useAdminCheck();
  const { toast } = useToast();

  // Get user on component mount
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check if current user is admin
  const isAdmin = user?.email === ADMIN_EMAIL;

  // Debug logging
  console.log("Header Debug:", {
    userEmail: user?.email,
    isAdminFromHook,
    isAdmin,
    ADMIN_EMAIL
  });

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out successfully",
        description: "You have been signed out.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const navItems = useMemo(() => {
    const base = [
      { name: "Products", path: "/products" },
      { name: "About", path: "/about" },
      { name: "Services", path: "/services" },
      { name: "Contact", path: "/contact" },
      { name: "Quote", path: "/quote" },
      { name: "Reach Out", path: "/reach-out" },
    ];

    // Only show Manage Products if user is admin (owner)
    if (isAdmin) {
      console.log("Adding Manage Products to navigation");
      return [
        ...base,
        { name: "Manage Products", path: "/admin/products" },
        { name: "Security", path: "/security" }
      ];
    }

    return base;
  }, [isAdmin]);

  const isActive = (path: string) => location.pathname === path;

  const getUserInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  const truncateEmail = (email: string, maxLength: number = 20) => {
    if (email.length <= maxLength) return email;
    return email.substring(0, maxLength - 3) + "...";
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <img
              src="/logo.png"
              alt="V&C Global Logo"
              className="w-10 h-10 object-contain"
            />
            <span className="text-xl font-bold text-gray-900 hidden sm:block">V&C Global</span>
            <span className="text-lg font-bold text-gray-900 sm:hidden">V&C</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 flex-1 justify-center">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary whitespace-nowrap ${
                  isActive(item.path)
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-600"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-100">
                    <Avatar className="h-8 w-8 bg-gray-100">
                      <AvatarFallback className="text-xs text-gray-700 bg-gray-200">
                        {getUserInitials(user.email)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-gray-900 max-w-32 truncate">
                      {truncateEmail(user.email, 25)}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <div className="px-3 py-2 border-b">
                    <p className="text-sm font-medium text-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm" className="text-sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Tablet Navigation (Medium screens) */}
          <nav className="hidden md:flex lg:hidden items-center space-x-4 flex-1 justify-center">
            {navItems.slice(0, 4).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary whitespace-nowrap ${
                  isActive(item.path)
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-600"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Tablet Actions */}
          <div className="hidden md:flex lg:hidden items-center space-x-2 flex-shrink-0">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6 bg-gray-100">
                      <AvatarFallback className="text-xs text-gray-700 bg-gray-200">
                        {getUserInitials(user.email)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium text-gray-900 max-w-20 truncate">
                      {truncateEmail(user.email, 15)}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <div className="px-3 py-2 border-b">
                    <p className="text-sm font-medium text-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm" className="text-sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6 bg-gray-100">
                      <AvatarFallback className="text-xs text-gray-700 bg-gray-200">
                        {getUserInitials(user.email)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <div className="px-3 py-2 border-b">
                    <p className="text-sm font-medium text-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm" className="text-sm">
                  Sign In
                </Button>
              </Link>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive(item.path) ? "text-primary" : "text-gray-600"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
