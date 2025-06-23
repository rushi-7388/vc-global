import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ConsultationForm } from "@/components/ConsultationForm";

const Consultation = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary mb-6">
            Book Your Consultation
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform your vision into reality with our expert guidance. 
            Schedule a personalized consultation to discuss your project needs, 
            explore our premium collection, and get professional recommendations.
          </p>
        </div>
        
        <div className="mb-16">
          <ConsultationForm />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-primary font-bold text-xl">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Schedule</h3>
            <p className="text-muted-foreground">
              Choose your preferred date and time for the consultation
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-primary font-bold text-xl">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Discuss</h3>
            <p className="text-muted-foreground">
              Share your project details and requirements with our experts
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-primary font-bold text-xl">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Transform</h3>
            <p className="text-muted-foreground">
              Get personalized recommendations and bring your vision to life
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Consultation;
