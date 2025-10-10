// AboutUsSection.jsx - Enhanced Version
import React from "react";
import { Award, Heart, ShieldCheck, Truck, Users, Zap } from "lucide-react";

const AboutUsSection = ({ about = "" }) => {
  // Features/highlights data
  const features = [
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: "Quality Assured",
      description: "100% authentic products with quality guarantee",
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Fast Delivery",
      description: "Quick and reliable shipping to your doorstep",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Customer First",
      description: "Dedicated support team at your service",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Best Prices",
      description: "Competitive prices with regular offers",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Trusted by Thousands",
      description: "Join our growing community of happy customers",
    },
    // {
    //   icon: <Zap className="w-8 h-8" />,
    //   title: "Easy Returns",
    //   description: "Hassle-free returns and exchange policy",
    // },
  ];

  // Default about text if none provided
  const defaultAbout = `We are committed to providing you with the best shopping experience. 
    Our mission is to deliver high-quality products at competitive prices, 
    backed by exceptional customer service. With years of experience in the industry, 
    we've built a reputation for reliability, quality, and customer satisfaction.`;

  const aboutText = about || defaultAbout;

  return (
    <section className="py-16 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="container mx-auto px-4">
        {/* Main About Us Content */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="text-center space-y-6">
            {/* Section Title */}
            <div className="inline-block">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
                About Us
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-green-600 to-emerald-600 mx-auto rounded-full"></div>
            </div>

            {/* About Text */}
            <p className="text-gray-700 leading-relaxed text-lg md:text-xl max-w-3xl mx-auto whitespace-pre-line">
              {aboutText}
            </p>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="bg-white/80 backdrop-blur rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                  10K+
                </div>
                <div className="text-gray-600 text-sm md:text-base">
                  Happy Customers
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                  500+
                </div>
                <div className="text-gray-600 text-sm md:text-base">
                  Products
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                  99%
                </div>
                <div className="text-gray-600 text-sm md:text-base">
                  Satisfaction
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                  24/7
                </div>
                <div className="text-gray-600 text-sm md:text-base">
                  Support
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-10">
            Why Choose Us?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-2 group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="max-w-4xl mx-auto mt-16 text-center">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 md:p-12 text-white shadow-2xl">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Start Shopping?
            </h3>
            <p className="text-lg mb-6 text-green-50">
              Join thousands of satisfied customers and experience the best online shopping.
            </p>
            <a
              href="/shop/listing"
              className="inline-block bg-white text-green-600 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Explore Products
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;