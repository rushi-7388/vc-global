
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export const Hero = () => {
  return (
    <div className="relative bg-black text-yellow-400">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1615971677499-5467cbab01c0?q=80&w=2070')] bg-cover bg-center opacity-10"></div>
      
      <div className="relative container mx-auto px-4 py-24 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <img 
              src="/lovable-uploads/8fc6217e-c3e7-4f1f-bfbf-3b14cb156d5d.png" 
              alt="V&C Global Logo" 
              className="h-16 w-16 mr-4"
            />
            <span className="text-yellow-400 font-semibold text-lg font-cinzel">RULE THE QUALITY</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight font-cinzel">
            V&C GLOBAL
            <span className="block text-yellow-500">Tiles & Marbles</span>
          </h1>
          
          <div className="mb-8">
            <p className="text-yellow-200 mb-4 font-cinzel text-lg">• EXPORTING QUALITY TILES & SANITARY PRODUCTS.</p>
            <p className="text-yellow-200 mb-4 font-cinzel text-lg">• PROVIDING PRODUCTS AS PER YOUR NEEDS.</p>
            <p className="text-yellow-200 mb-4 font-cinzel text-lg">• RELIABLE NATIONWIDE & GLOBAL DELIVERY.</p>
            <p className="text-yellow-200 mb-4 font-cinzel text-lg">• SPECIAL OFFERS FOR RETAILERS & CONTRACTORS.</p>
            <p className="text-yellow-200 mb-4 font-cinzel text-lg">• UNIQUE COLLECTIONS FOR INTERIOR DESIGNERS.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black text-lg px-8 py-4 font-cinzel font-semibold">
              Explore Collection
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black text-lg px-8 py-4 font-cinzel font-semibold"
            >
              Request Quote
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
            <div className="bg-yellow-400/10 backdrop-blur-sm rounded-lg p-6 border border-yellow-400/30">
              <h3 className="text-xl font-bold text-yellow-400 mb-2 font-cinzel">VRUSHANG GHEEWALA</h3>
              <p className="text-yellow-200 font-cinzel">99786-06345</p>
            </div>
            <div className="bg-yellow-400/10 backdrop-blur-sm rounded-lg p-6 border border-yellow-400/30">
              <h3 className="text-xl font-bold text-yellow-400 mb-2 font-cinzel">CHIRAG RAJPUT</h3>
              <p className="text-yellow-200 font-cinzel">72650-55583</p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-yellow-200 font-cinzel">vcglobal1012@gmail.com</p>
            <p className="text-yellow-200 font-cinzel">@vcglobal_</p>
          </div>
        </div>
      </div>
    </div>
  );
};
