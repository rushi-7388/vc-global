
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { env } from "@/config/env";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <div className="relative bg-background text-foreground overflow-hidden">
      {/* 3D Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative container mx-auto px-4 py-24 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-8 float-animation">
            <img 
              src="/uploads/pic1.png" 
              alt="V&C Global Logo" 
              className="h-20 w-20 mr-4 pulse-glow rounded-full"
            />
            <span className="neon-cyan font-bold text-xl tracking-wider">RULE THE QUALITY</span>
          </div>
          
          <h1 className="text-6xl lg:text-8xl font-bold mb-8 leading-tight">
            <span className="holographic block mb-2">{env.APP_NAME}</span>
            <span className="holographic">Tiles & Marbles</span>
          </h1>
          
          <div className="mb-12 space-y-4">
            <div className="glass-card p-6 rounded-2xl mb-6">
              <p className="text-foreground/90 mb-3 text-lg font-medium">• EXPORTING QUALITY TILES & SANITARY PRODUCTS.</p>
              <p className="text-foreground/90 mb-3 text-lg font-medium">• PROVIDING PRODUCTS AS PER YOUR NEEDS.</p>
              <p className="text-foreground/90 mb-3 text-lg font-medium">• RELIABLE NATIONWIDE & GLOBAL DELIVERY.</p>
              <p className="text-foreground/90 mb-3 text-lg font-medium">• SPECIAL OFFERS FOR RETAILERS & CONTRACTORS.</p>
              <p className="text-foreground/90 text-lg font-medium">• UNIQUE COLLECTIONS FOR INTERIOR DESIGNERS.</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link to="/products">
              <Button size="lg" className="btn-3d text-lg px-10 py-6 font-bold rounded-2xl">
                Explore Collection
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
            <Link to="/quote">
              <Button 
                variant="outline" 
                size="lg" 
                className="glass-card border-primary/50 neon-cyan hover:bg-primary/20 text-lg px-10 py-6 font-bold rounded-2xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(13,148,136,0.5)]"
              >
                Request Quote
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
            <div className="glass-card card-3d p-8 rounded-2xl border border-primary/20 hover:border-primary/40 transition-all duration-300">
              <h3 className="text-2xl font-bold neon-cyan mb-3">VRUSHANG GHEEWALA</h3>
              <p className="text-foreground/80 text-lg">{env.COMPANY_PHONE_1}</p>
            </div>
            <div className="glass-card card-3d p-8 rounded-2xl border border-accent/20 hover:border-accent/40 transition-all duration-300">
              <h3 className="text-2xl font-bold neon-pink mb-3">CHIRAG RAJPUT</h3>
              <p className="text-foreground/80 text-lg">{env.COMPANY_PHONE_2}</p>
            </div>
          </div>
          
          <div className="mt-12 glass-card p-6 rounded-2xl">
            <p className="text-foreground/80 text-lg mb-2">{env.COMPANY_EMAIL}</p>
            <p className="text-foreground/80 text-lg">{env.COMPANY_INSTAGRAM}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
