// import { Palette, Wrench, Truck, HeadphonesIcon } from "lucide-react";

// export const ServicesSection = () => {
//   const services = [
//     {
//       icon: Palette,
//       title: "Design Consultation",
//       description: "Our expert designers help you choose the perfect materials for your space, considering aesthetics, functionality, and budget."
//     },
//     // {
//     //   icon: Wrench,
//     //   title: "Installation Services",
//     //   description: "Professional installation by certified craftsmen ensuring perfect finish and long-lasting results."
//     // },
//     {
//       icon: Truck,
//       title: "Delivery & Logistics",
//       description: "Safe and timely delivery with proper packaging and handling to ensure your materials arrive in perfect condition."
//     },
//     {
//       icon: HeadphonesIcon,
//       title: "After-Sales Support",
//       description: "Comprehensive maintenance guidance and support to keep your installations looking pristine for years."
//     }
//   ];

//   return (
//     <section id="services" className="py-20 bg-background border-t border-border">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-16">
//           <h2 className="text-4xl font-bold text-primary mb-4">
//             Our Services
//           </h2>
//           <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
//             From consultation to installation, we provide comprehensive services
//             to make your dream space a reality.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//           {services.map((service, index) => (
//             <div key={index} className="bg-card p-6 rounded-lg border border-border hover:border-primary/40 transition-all">
//               <div className="bg-primary/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
//                 <service.icon className="h-6 w-6 text-primary" />
//               </div>
//               <h3 className="text-xl font-semibold text-primary mb-3">
//                 {service.title}
//               </h3>
//               <p className="text-muted-foreground">
//                 {service.description}
//               </p>
//             </div>
//           ))}
//         </div>

//         <div className="mt-16 bg-card border border-border rounded-2xl p-8 md:p-12">
//           <div className="text-center">
//             <h3 className="text-3xl font-bold text-primary mb-6">
//               Ready to Transform Your Space?
//             </h3>
//             <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
//               Get a free consultation and quote for your project. Our experts are ready
//               to help you create the perfect space with our premium materials.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-semibold transition-colors">
//                 Get Free Quote
//               </button>
//               <button className="border border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 rounded-lg font-semibold transition-colors">
//                 Schedule Consultation
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };


import { Palette, Truck, HeadphonesIcon } from "lucide-react";

export const ServicesSection = () => {
  const services = [
    {
      icon: Palette,
      title: "Design Consultation",
      description:
        "Our expert designers help you choose the perfect materials for your space, considering aesthetics, functionality, and budget.",
    },
    {
      icon: Truck,
      title: "Delivery & Logistics",
      description:
        "Safe and timely delivery with proper packaging and handling to ensure your materials arrive in perfect condition.",
    },
    {
      icon: HeadphonesIcon,
      title: "After-Sales Support",
      description:
        "Comprehensive maintenance guidance and support to keep your installations looking pristine for years.",
    },
  ];

  return (
    <section
      id="services"
      className="py-20 bg-background border-t border-border"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          
          <h2 className="text-4xl font-bold tracking-tight text-primary mb-4">
            Our Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From consultation to delivery, we provide comprehensive services
            tailored to your project needs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl border border-border hover:shadow-lg transition-shadow p-6"
            >
              <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-xl mb-4">
                <service.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-primary mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Box */}
        {/* <div className="mt-20 bg-muted/30 border border-border rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-3xl font-bold text-primary mb-4">
            Ready to Transform Your Space?
          </h3>
          <p className="text-muted-foreground text-base max-w-2xl mx-auto mb-6">
            Get a free consultation and quote for your project. Our experts are
            ready to help you create the perfect space with premium materials.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition">
              Get Free Quote
            </button>
            <button className="border border-primary text-primary hover:bg-primary hover:text-white px-6 py-3 rounded-lg font-medium transition">
              Schedule Consultation
            </button>
          </div>
        </div> */}
      </div>
    </section>
  );
};
