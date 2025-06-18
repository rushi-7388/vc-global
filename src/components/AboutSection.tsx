import { Award, Users, Globe, Truck } from "lucide-react";

export const AboutSection = () => {
  const features = [
    {
      icon: Award,
      title: "Premium Quality",
      description:
        "Handpicked materials from the finest quarries worldwide, ensuring exceptional quality and durability.",
    },
    {
      icon: Users,
      title: "Expert Team",
      description:
        "Our skilled craftsmen and designers bring decades of experience to every project.",
    },
    {
      icon: Globe,
      title: "Global Sourcing",
      description:
        "Direct imports from Italy, Turkey, and other renowned marble and tile regions.",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description:
        "Efficient logistics network ensuring timely delivery across India and beyond.",
    },
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">
            Why Choose V&C Global?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Excellence isn’t a promise — it’s our standard. When you choose us,
            you choose precision, integrity, and a partner committed to your
            success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow bg-card border border-border"
            >
              <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-card border border-border rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-primary mb-6">
                Our Story
              </h3>
              <p className="text-muted-foreground mb-4">
                From late-night college discussions to early morning factory
                visits, our journey began with a shared purpose — to build
                something meaningful from the ground up. As best friends turned
                business partners, we traveled across India, connecting with
                manufacturers, quarry owners, and industry experts, learning not
                just the trade, but the trust it carries.
              </p>
              <p className="text-muted-foreground mb-6">
                V&C Global was born out of that passion — to represent India’s
                finest to the world with honesty, precision, and heart. Today,
                every deal we make is more than business; it’s a reflection of
                our values, our bond, and our unwavering commitment to quality.
              </p>
              {/* <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary">35+</div>
                  <div className="text-sm text-muted-foreground">
                    Years Experience
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">10K+</div>
                  <div className="text-sm text-muted-foreground">
                    Happy Customers
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">25+</div>
                  <div className="text-sm text-muted-foreground">
                    Countries Served
                  </div>
                </div>
              </div> */}
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800"
                alt="Marble showroom"
                className="rounded-lg shadow-lg w-full h-80 object-cover border border-border"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
