
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, MessageCircle } from "lucide-react";
import { AuthButton } from "@/components/AuthButton";
import { LiveChat } from "@/components/LiveChat";
import { RealtimeNotifications } from "@/components/RealtimeNotifications";
import { RealtimeQuoteNotifications } from "@/components/RealtimeQuoteNotifications";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
    // { name: "Get Quote", path: "/quote" },
    // { name: "Reach Out", path: "/reach-out" },
  ];

  const handleNavClick = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/logo.png" 
              alt="Company Logo" 
              className="h-8 w-8"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="text-xl font-bold text-primary">
              Tiles & Marbles
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-2">
            {/* <RealtimeNotifications />
            <RealtimeQuoteNotifications /> */}
            {/* <Button
              variant="outline"
              size="icon"
              onClick={() => setShowChat(true)}
            >
              <MessageCircle className="h-4 w-4" />
            </Button> */}
            <AuthButton />
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center space-x-2">
            <RealtimeNotifications />
            <RealtimeQuoteNotifications />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowChat(true)}
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
            <AuthButton />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => handleNavClick(item.path)}
                      className="text-left text-lg font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item.name}
                    </button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {showChat && <LiveChat />}
    </>
  );
};
