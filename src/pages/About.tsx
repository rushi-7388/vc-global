
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AboutSection } from "@/components/AboutSection";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">About V&C Global</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Learn about our commitment to quality, our history, and our mission to 
            provide the finest tiles and marbles globally.
          </p>
        </div>
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
};

export default About;
