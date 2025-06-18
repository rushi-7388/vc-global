
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ServicesSection } from "@/components/ServicesSection";

const Services = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4">
        {/* <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Our Services</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From consultation to installation, we provide comprehensive services 
            to meet all your tile and marble needs.
          </p>
        </div> */}
        <ServicesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Services;
