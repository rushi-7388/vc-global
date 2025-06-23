import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { QuoteForm } from "@/components/QuoteForm";

const Quote = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Get Quote</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Request a personalized quote for your project. Fill out the form below 
            and we'll get back to you with competitive pricing.
          </p>
        </div>
        <QuoteForm />
      </main>
      <Footer />
    </div>
  );
};

export default Quote;
