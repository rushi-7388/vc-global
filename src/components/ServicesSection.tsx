
import { Palette, Wrench, Truck, HeadphonesIcon } from "lucide-react";

export const ServicesSection = () => {
  const services = [
    {
      icon: Palette,
      title: "Design Consultation",
      description: "Our expert designers help you choose the perfect materials for your space, considering aesthetics, functionality, and budget."
    },
    {
      icon: Wrench,
      title: "Installation Services",
      description: "Professional installation by certified craftsmen ensuring perfect finish and long-lasting results."
    },
    {
      icon: Truck,
      title: "Delivery & Logistics",
      description: "Safe and timely delivery with proper packaging and handling to ensure your materials arrive in perfect condition."
    },
    {
      icon: HeadphonesIcon,
      title: "After-Sales Support",
      description: "Comprehensive maintenance guidance and support to keep your installations looking pristine for years."
    }
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From consultation to installation, we provide comprehensive services 
            to make your dream space a reality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <service.icon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-2xl p-8 md:p-12 shadow-sm">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Ready to Transform Your Space?
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Get a free consultation and quote for your project. Our experts are ready 
              to help you create the perfect space with our premium materials.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                Get Free Quote
              </button>
              <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition-colors">
                Schedule Consultation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
