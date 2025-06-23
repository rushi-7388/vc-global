import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/ContactForm";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Contact Us</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get in touch with us for any inquiries, quotes, or support. 
            We're here to help you with all your tile and marble needs.
          </p>
        </div>
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
