
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ReachOutForm } from "@/components/ReachOutForm";

const ReachOut = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Reach Out</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Connect with us directly. Share your details and requirements, 
            and we'll reach out to you personally.
          </p>
        </div>
        <ReachOutForm />
      </main>
      <Footer />
    </div>
  );
};

export default ReachOut;
