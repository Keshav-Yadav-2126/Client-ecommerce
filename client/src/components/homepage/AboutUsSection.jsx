// AboutUsSection.jsx - Enhanced Version
import React from "react";
import { Award, Heart, ShieldCheck, Truck, Users, Zap } from "lucide-react";

const AboutUsSection = ({ about = "" }) => {
  const features = [
    {
      icon: <ShieldCheck className="w-5 h-5 sm:w-8 sm:h-8" />,
      title: "Quality Assured",
      description: "100% authentic products with quality guarantee",
    },
    {
      icon: <Truck className="w-5 h-5 sm:w-8 sm:h-8" />,
      title: "Fast Delivery",
      description: "Quick and reliable shipping to your doorstep",
    },
    {
      icon: <Heart className="w-5 h-5 sm:w-8 sm:h-8" />,
      title: "Customer First",
      description: "Dedicated support team at your service",
    },
    {
      icon: <Award className="w-5 h-5 sm:w-8 sm:h-8" />,
      title: "Best Prices",
      description: "Competitive prices with regular offers",
    },
    {
      icon: <Users className="w-5 h-5 sm:w-8 sm:h-8" />,
      title: "Trusted by Thousands",
      description: "Join our growing community of happy customers",
    },
  ];

  const defaultAbout = `We are committed to providing you with the best shopping experience. 
    Our mission is to deliver high-quality products at competitive prices, 
    backed by exceptional customer service. With years of experience in the industry, 
    we've built a reputation for reliability, quality, and customer satisfaction.`;

  const aboutText = about || defaultAbout;

  return (
    <section className="py-8 sm:py-16 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto mb-8 sm:mb-16">
          <div className="text-center space-y-3 sm:space-y-6">
            <div className="max-w-4xl mx-auto mt-8 sm:mt-16 text-center">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 text-white shadow-2xl">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4">
                  Ready to Start Shopping?
                </h3>
                <p className="text-sm sm:text-lg mb-4 sm:mb-6 text-green-50">
                  Join thousands of satisfied customers and experience the best
                  online shopping.
                </p>
                <a
                  href="/shop/listing"
                  className="inline-block bg-white text-green-600 font-semibold px-6 py-2 sm:px-8 sm:py-3 rounded-full hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
                >
                  Explore Products
                </a>
              </div>
            </div>

            <div className="inline-block">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-2">
                About Us
              </h2>
              <div className="h-1 w-16 sm:w-24 bg-gradient-to-r from-green-600 to-emerald-600 mx-auto rounded-full"></div>
            </div>

            <p className="text-sm sm:text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto whitespace-pre-line">
              {aboutText}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mt-6 sm:mt-12">
              <div className="bg-white/80 backdrop-blur rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-xl sm:text-3xl md:text-4xl font-bold text-green-600 mb-1 sm:mb-2">
                  1K+
                </div>
                <div className="text-gray-600 text-xs sm:text-sm md:text-base">
                  Happy Customers
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-xl sm:text-3xl md:text-4xl font-bold text-green-600 mb-1 sm:mb-2">
                  20+
                </div>
                <div className="text-gray-600 text-xs sm:text-sm md:text-base">
                  Products
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-xl sm:text-3xl md:text-4xl font-bold text-green-600 mb-1 sm:mb-2">
                  99%
                </div>
                <div className="text-gray-600 text-xs sm:text-sm md:text-base">
                  Satisfaction
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-xl sm:text-3xl md:text-4xl font-bold text-green-600 mb-1 sm:mb-2">
                  24/7
                </div>
                <div className="text-gray-600 text-xs sm:text-sm md:text-base">
                  Support
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-10">
            Why Choose Us?
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-6 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-2 group"
              >
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-1.5 sm:gap-4">
                  <div className="flex-shrink-0 w-8 h-8 sm:w-14 sm:h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h4 className="text-xs sm:text-lg font-semibold text-gray-800 mb-0 sm:mb-2">
                      {feature.title}
                    </h4>
                    <p className="hidden sm:block text-sm text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* <div className="max-w-4xl mx-auto mt-8 sm:mt-16 text-center">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 text-white shadow-2xl">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4">
              Ready to Start Shopping?
            </h3>
            <p className="text-sm sm:text-lg mb-4 sm:mb-6 text-green-50">
              Join thousands of satisfied customers and experience the best online shopping.
            </p>
            <a
              href="/shop/listing"
              className="inline-block bg-white text-green-600 font-semibold px-6 py-2 sm:px-8 sm:py-3 rounded-full hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
            >
              Explore Products
            </a>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default AboutUsSection;
