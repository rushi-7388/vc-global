import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";
import { env } from "@/config/env";

export const Footer = () => {
  return (
    <footer className="bg-card text-card-foreground border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <img
                src="/uploads/pic2.png"
                alt="V&C Global Logo"
                className="h-8 w-8 mr-2"
              />
              <h3 className="text-xl font-bold text-primary">{env.APP_NAME}</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Your trusted partner for premium tiles, marbles, and natural
              stones. We bring elegance and quality to every space.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
              <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
              <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a
                  href="/about"
                  className="hover:text-primary transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/products"
                  className="hover:text-primary transition-colors"
                >
                  Our Products
                </a>
              </li>
              <li>
                <a
                  href="/services"
                  className="hover:text-primary transition-colors"
                >
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Portfolio
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="hover:text-primary transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Our Products</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="/products" className="hover:text-primary transition-colors">
                  Italian Marble
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-primary transition-colors">
                  Designer Tiles
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-primary transition-colors">
                  Natural Stone
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-primary transition-colors">
                  Sanitary Products 
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-primary transition-colors">
                  Granite
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3 text-muted-foreground">
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-primary" />
                <span>{env.COMPANY_PHONE_1}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-primary" />
                <span>{env.COMPANY_PHONE_2}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-primary" />
                <a
                  href={`mailto:${env.COMPANY_EMAIL}`}
                  className="hover:text-primary transition-colors"
                >
                  {env.COMPANY_EMAIL}
                </a>
              </div>
              <div className="flex items-center">
                <Instagram className="h-5 w-5 mr-3 text-primary" />
                <a
                  href={`https://instagram.com/${env.COMPANY_INSTAGRAM.replace(
                    "@",
                    ""
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  {env.COMPANY_INSTAGRAM}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>
            &copy; 2025 {env.APP_NAME} Tiles & Marbles. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
