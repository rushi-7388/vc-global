
import { Award, Users, Globe, Truck } from "lucide-react";

export const AboutSection = () => {
  const features = [
    {
      icon: Award,
      title: "Premium Quality",
      description: "Handpicked materials from the finest quarries worldwide, ensuring exceptional quality and durability."
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Our skilled craftsmen and designers bring decades of experience to every project."
    },
    {
      icon: Globe,
      title: "Global Sourcing",
      description: "Direct imports from Italy, Turkey, and other renowned marble and tile regions."
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Efficient logistics network ensuring timely delivery across India and beyond."
    }
  ];

  return (
    <section id="about" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-yellow-400 mb-4 font-cinzel">
            Why Choose V&C Global?
          </h2>
          <p className="text-xl text-yellow-200 max-w-3xl mx-auto font-cinzel">
            With over 35 years of experience, we've built our reputation on quality, 
            reliability, and exceptional customer service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow bg-yellow-400/5 border border-yellow-400/20">
              <div className="bg-yellow-400/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="h-8 w-8 text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-yellow-400 mb-3 font-cinzel">
                {feature.title}
              </h3>
              <p className="text-yellow-200 font-cinzel">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-yellow-400/5 border border-yellow-400/20 rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-yellow-400 mb-6 font-cinzel">
                Our Story
              </h3>
              <p className="text-yellow-200 mb-4 font-cinzel">
                Founded in 1985, V&C Global started as a small family business with a vision 
                to bring the world's finest marbles and tiles to Indian homes and businesses. 
                Today, we're proud to be one of India's leading importers and suppliers of 
                premium stone materials.
              </p>
              <p className="text-yellow-200 mb-6 font-cinzel">
                Our commitment to quality and customer satisfaction has helped us serve over 
                10,000 satisfied customers across 25+ countries, making us a trusted name in 
                the industry.
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-yellow-400 font-cinzel">35+</div>
                  <div className="text-sm text-yellow-200 font-cinzel">Years Experience</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-400 font-cinzel">10K+</div>
                  <div className="text-sm text-yellow-200 font-cinzel">Happy Customers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-400 font-cinzel">25+</div>
                  <div className="text-sm text-yellow-200 font-cinzel">Countries Served</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800"
                alt="Marble showroom"
                className="rounded-lg shadow-lg w-full h-80 object-cover border border-yellow-400/20"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
