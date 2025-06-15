
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { env } from "@/config/env";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <div className="relative bg-background text-foreground">
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-background"></div>
      
      <div className="relative container mx-auto px-4 py-24 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <img 
              src="/uploads/pic1.png" 
              alt="V&C Global Logo" 
              className="h-16 w-16 mr-4"
            />
            <span className="text-yellow-400 font-semibold text-lg">RULE THE QUALITY</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-yellow-400">{env.APP_NAME}</span>
            <span className="block text-yellow-400">Tiles & Marbles</span>
          </h1>
          
          <div className="mb-8">
            <p className="text-muted-foreground mb-4 text-lg">• EXPORTING QUALITY TILES & SANITARY PRODUCTS.</p>
            <p className="text-muted-foreground mb-4 text-lg">• PROVIDING PRODUCTS AS PER YOUR NEEDS.</p>
            <p className="text-muted-foreground mb-4 text-lg">• RELIABLE NATIONWIDE & GLOBAL DELIVERY.</p>
            <p className="text-muted-foreground mb-4 text-lg">• SPECIAL OFFERS FOR RETAILERS & CONTRACTORS.</p>
            <p className="text-muted-foreground mb-4 text-lg">• UNIQUE COLLECTIONS FOR INTERIOR DESIGNERS.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/products">
              <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-black text-lg px-8 py-4 font-semibold">
                Explore Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/quote">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black text-lg px-8 py-4 font-semibold"
              >
                Request Quote
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
            <div className="bg-card backdrop-blur-sm rounded-lg p-6 border border-border">
              <h3 className="text-xl font-bold text-yellow-400 mb-2">VRUSHANG GHEEWALA</h3>
              <p className="text-muted-foreground">{env.COMPANY_PHONE_1}</p>
            </div>
            <div className="bg-card backdrop-blur-sm rounded-lg p-6 border border-border">
              <h3 className="text-xl font-bold text-yellow-400 mb-2">CHIRAG RAJPUT</h3>
              <p className="text-muted-foreground">{env.COMPANY_PHONE_2}</p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-muted-foreground">{env.COMPANY_EMAIL}</p>
            <p className="text-muted-foreground">{env.COMPANY_INSTAGRAM}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
