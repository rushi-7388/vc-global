
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export const Hero = () => {
  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1615971677499-5467cbab01c0?q=80&w=2070')] bg-cover bg-center opacity-20"></div>
      
      <div className="relative container mx-auto px-4 py-24 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="h-8 w-8 text-yellow-400 mr-3" />
            <span className="text-yellow-400 font-semibold text-lg">Premium Quality Since 1985</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            V&C Global
            <span className="block text-blue-400">Tiles & Marbles</span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform your spaces with our exquisite collection of Italian marbles, 
            designer tiles, and premium natural stones. Crafted for elegance, built to last.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4">
              Explore Collection
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white hover:text-slate-900 text-lg px-8 py-4"
            >
              Request Quote
            </Button>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h3 className="text-2xl font-bold text-blue-400 mb-2">10,000+</h3>
              <p className="text-gray-300">Happy Customers</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h3 className="text-2xl font-bold text-blue-400 mb-2">500+</h3>
              <p className="text-gray-300">Premium Products</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h3 className="text-2xl font-bold text-blue-400 mb-2">25+</h3>
              <p className="text-gray-300">Countries Served</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
