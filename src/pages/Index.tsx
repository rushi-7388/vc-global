
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Star, Phone, Mail, MapPin } from "lucide-react";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Header */}
      <nav className="bg-black/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">V&C GLOBAL</h1>
              <span className="ml-2 text-yellow-400 text-sm">Premium Tiles & Marbles</span>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <a href="#home" className="text-white hover:text-yellow-400 transition-colors">Home</a>
              <a href="#products" className="text-white hover:text-yellow-400 transition-colors">Products</a>
              <a href="#services" className="text-white hover:text-yellow-400 transition-colors">Services</a>
              <a href="#about" className="text-white hover:text-yellow-400 transition-colors">About</a>
              <a href="#contact" className="text-white hover:text-yellow-400 transition-colors">Contact</a>
            </div>

            <Button 
              className="md:hidden bg-yellow-400 text-black hover:bg-yellow-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              Menu
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23333333" fill-opacity="0.1"%3E%3Ccircle cx="7" cy="7" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-yellow-400 to-white bg-clip-text text-transparent">
              V&C GLOBAL
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Premium Quality Tiles & Marbles for Your Dream Spaces
            </p>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Discover our exclusive collection of luxury tiles and exquisite marbles from around the world. 
              Transform your spaces with elegance and sophistication.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button 
                size="lg" 
                className="bg-yellow-400 text-black hover:bg-yellow-500 text-lg px-8 py-4"
              >
                Explore Products <ArrowRight className="ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black text-lg px-8 py-4"
              >
                Get Quote
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="products" className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Premium Collection</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Handpicked selection of the finest tiles and marbles for luxury interiors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Italian Marble",
                description: "Genuine Carrara and Calacatta marble imported directly from Italy",
                features: ["Premium Quality", "Natural Patterns", "Lifetime Durability"]
              },
              {
                title: "Designer Tiles",
                description: "Contemporary and classic tile designs for modern spaces",
                features: ["Latest Designs", "Multiple Sizes", "Easy Maintenance"]
              },
              {
                title: "Natural Stone",
                description: "Authentic natural stones including granite, sandstone, and slate",
                features: ["Weather Resistant", "Unique Textures", "Eco-Friendly"]
              }
            ].map((product, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 p-6 hover:border-yellow-400 transition-all duration-300 transform hover:scale-105">
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-white">{product.title}</h3>
                  <p className="text-gray-400">{product.description}</p>
                  <ul className="space-y-2">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-300">
                        <Star className="w-4 h-4 text-yellow-400 mr-2 fill-current" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-500 mt-4">
                    View Collection
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Services</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Complete solutions for all your tiling and marble needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              "Consultation & Design",
              "Supply & Installation",
              "Custom Cutting",
              "Maintenance & Care"
            ].map((service, index) => (
              <div key={index} className="text-center p-6 rounded-lg bg-gray-900 hover:bg-gray-800 transition-colors">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-black font-bold text-xl">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{service}</h3>
                <p className="text-gray-400">Professional service with attention to detail</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-t from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Ready to start your project? Contact us for expert consultation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gray-800 border-gray-700 p-8 text-center">
              <Phone className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Call Us</h3>
              <p className="text-gray-400">+91 98765 43210</p>
              <p className="text-gray-400">+91 87654 32109</p>
            </Card>

            <Card className="bg-gray-800 border-gray-700 p-8 text-center">
              <Mail className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Email Us</h3>
              <p className="text-gray-400">info@vcglobal.com</p>
              <p className="text-gray-400">sales@vcglobal.com</p>
            </Card>

            <Card className="bg-gray-800 border-gray-700 p-8 text-center">
              <MapPin className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Visit Us</h3>
              <p className="text-gray-400">Gujarat, India</p>
              <p className="text-gray-400">Showroom Opening Soon</p>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="bg-yellow-400 text-black hover:bg-yellow-500 text-lg px-12 py-4">
              Request Free Consultation
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-2">V&C GLOBAL</h3>
            <p className="text-gray-400 mb-4">Premium Tiles & Marbles</p>
            <p className="text-gray-500 text-sm">
              © 2024 V&C Global. All rights reserved. | Crafted with excellence in Gujarat, India
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
