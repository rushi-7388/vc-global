
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Mail } from "lucide-react";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "#" },
    { name: "Products", href: "#products" },
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header className="bg-black shadow-lg sticky top-0 z-50 border-b border-yellow-900">
      {/* Top bar with contact info */}
      <div className="bg-black text-yellow-400 py-2 border-b border-yellow-900">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm font-cinzel">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-1" />
              <span>+91 99786 06345</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-1" />
              <span>vcglobal1012@gmail.com</span>
            </div>
          </div>
          <div className="hidden md:block">
            <span className="font-cinzel">RULE THE QUALITY</span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/af9a4a81-ee64-4ccf-923f-54687632a24f.png" 
              alt="V&C Global Logo" 
              className="h-12 w-12 mr-3"
            />
            <div>
              <h1 className="text-2xl font-bold text-yellow-400 font-cinzel">
                V&C GLOBAL
              </h1>
              <p className="text-xs text-yellow-300 font-cinzel">RULE THE QUALITY</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-yellow-200 hover:text-yellow-400 font-medium transition-colors font-cinzel"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-cinzel font-semibold">
              Get Quote
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-yellow-200 hover:text-yellow-400"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-yellow-200 hover:text-yellow-400 font-medium transition-colors font-cinzel"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black w-full font-cinzel font-semibold">
                Get Quote
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
