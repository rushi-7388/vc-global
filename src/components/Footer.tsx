
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Linkedin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-black text-yellow-400 border-t border-yellow-900">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <img 
                src="/lovable-uploads/af9a4a81-ee64-4ccf-923f-54687632a24f.png" 
                alt="V&C Global Logo" 
                className="h-8 w-8 mr-2"
              />
              <h3 className="text-xl font-bold text-yellow-400 font-cinzel">
                V&C GLOBAL
              </h3>
            </div>
            <p className="text-yellow-200 mb-4 font-cinzel">
              Your trusted partner for premium tiles, marbles, and natural stones. 
              We bring elegance and quality to every space.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-yellow-200 hover:text-yellow-400 cursor-pointer" />
              <Instagram className="h-5 w-5 text-yellow-200 hover:text-yellow-400 cursor-pointer" />
              <Linkedin className="h-5 w-5 text-yellow-200 hover:text-yellow-400 cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 font-cinzel">Quick Links</h4>
            <ul className="space-y-2 text-yellow-200 font-cinzel">
              <li><a href="#" className="hover:text-yellow-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Our Products</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Services</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Portfolio</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-semibold mb-4 font-cinzel">Our Products</h4>
            <ul className="space-y-2 text-yellow-200 font-cinzel">
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Italian Marble</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Designer Tiles</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Natural Stone</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Premium Ceramics</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Granite</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 font-cinzel">Contact Info</h4>
            <div className="space-y-3 text-yellow-200 font-cinzel">
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-yellow-400" />
                <span>+91 99786 06345</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-yellow-400" />
                <span>+91 72650 55583</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-yellow-400" />
                <span>vcglobal1012@gmail.com</span>
              </div>
              <div className="flex items-center">
                <Instagram className="h-5 w-5 mr-3 text-yellow-400" />
                <span>@vcglobal_</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-yellow-900 mt-8 pt-8 text-center text-yellow-200">
          <p className="font-cinzel">&copy; 2025 V&C Global Tiles & Marbles. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
