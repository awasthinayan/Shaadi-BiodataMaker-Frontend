import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const totalHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  return (
    <div className="relative font-sans overflow-x-hidden">
      {/* Scroll Progress Bar */}
      <div
        className="fixed right-0 top-0 w-1 bg-gradient-to-b from-pink-500 to-purple-600 z-50 transition-all duration-200"
        style={{ height: `${scrollProgress}%` }}
      />

      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-rose-100 via-purple-100 to-cyan-100">
        <div className="absolute w-96 h-96 bg-pink-300 opacity-30 rounded-full blur-3xl animate-pulse top-20 left-20"></div>
        <div className="absolute w-96 h-96 bg-purple-300 opacity-30 rounded-full blur-3xl animate-pulse bottom-20 right-20"></div>
        <div className="absolute w-64 h-64 bg-yellow-200 opacity-20 rounded-full blur-3xl animate-pulse top-1/2 left-1/3"></div>
      </div>

      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 px-6 md:px-10 py-4 ${
          scrolled ? "bg-white/80 backdrop-blur-md shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-pink-600">
            💍 Shaadi-Biodata
          </h1>

        </div>
      </nav>

      {/* SECTION 1 - Hero */}
      <section className="h-screen flex flex-col justify-center items-center text-center px-6">
        <div className="max-w-4xl mx-auto animate-fadeInUp">
          <h2 className="text-5xl md:text-7xl font-bold text-gray-800 leading-tight">
            Create Your Perfect <br />
            Marriage Biodata ✨
          </h2>

          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Design beautiful, professional and traditional biodatas in minutes.
            Simple. Elegant. Fast.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleRegisterRedirect}
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-lg rounded-full hover:shadow-xl transform hover:scale-105 transition-all duration-200 hover:cursor-pointer"
            >
              Get Started Free
            </button>

            <button
              onClick={scrollToNext}
              className="px-8 py-3 border-2 border-pink-500 text-pink-500 text-lg rounded-full hover:bg-pink-50 transform hover:scale-105 transition-all duration-200 hover:cursor-pointer"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* SECTION 2 - Features */}
      <section className="min-h-screen flex flex-col justify-center items-center px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Why Choose Us?
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg mb-16">
            We help you create a clean, attractive and culturally appropriate
            biodata for marriage proposals.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎨",
                title: "Beautiful Templates",
                desc: "Choose from a variety of professionally designed templates.",
              },
              {
                icon: "⚡",
                title: "Instant Creation",
                desc: "Fill in your details and get your biodata ready in minutes.",
              },
              {
                icon: "🔒",
                title: "Privacy First",
                desc: "Your data is secure and never shared without your consent.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 grid md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="text-4xl font-bold text-pink-500">10K+</div>
              <p className="text-gray-600 mt-2">Biodatas Created</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-pink-500">4.9★</div>
              <p className="text-gray-600 mt-2">User Rating</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-pink-500">100%</div>
              <p className="text-gray-600 mt-2">Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 - How It Works */}
      <section className="py-20 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg mb-16">
            Three simple steps to your perfect marriage biodata.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Sign Up", desc: "Create your free account in seconds." },
              { step: "2", title: "Fill Details", desc: "Enter your personal and family information." },
              { step: "3", title: "Download", desc: "Get your beautiful biodata as PDF instantly." },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="w-16 h-16 bg-pink-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 - Testimonials */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            What Our Users Say
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg mb-16">
            Join thousands of happy couples who found their match using our biodatas.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                name: "Priya & Raj",
                text: "The biodata templates are beautiful and helped us present ourselves perfectly. Highly recommended!",
              },
              {
                name: "Amit Sharma",
                text: "So easy to use! Created my biodata in 10 minutes and got great responses.",
              },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg text-left"
              >
                <p className="text-gray-700 italic mb-4">"{testimonial.text}"</p>
                <p className="font-semibold text-pink-600">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 - Call to Action */}
      <section className="py-20 px-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Create Your Biodata?
          </h2>
          <p className="text-xl mb-10 opacity-90">
            Join thousands of happy users and find your perfect match today.
          </p>
          <button
            onClick={handleRegisterRedirect}
            className="px-10 py-4 bg-white text-pink-600 text-lg rounded-full font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-200 hover:cursor-pointer"
          >
            Get Started Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-pink-400 mb-4">Shaadi-Biodata</h3>
            <p className="text-gray-400">Create beautiful marriage biodatas in minutes.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><button onClick={handleRegisterRedirect} className="hover:text-pink-400 cursor-pointer">Register</button></li>
              <li><a href="#" className="hover:text-pink-400">About Us</a></li>
              <li><a href="#" className="hover:text-pink-400">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-pink-400">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-pink-400">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-pink-400">📘</a>
              <a href="#" className="text-gray-400 hover:text-pink-400">📷</a>
              <a href="#" className="text-gray-400 hover:text-pink-400">🐦</a>
            </div>
          </div>
        </div>
        <div className="text-center text-gray-500 mt-8 pt-8 border-t border-gray-800">
          © 2026 Shaadi-Biodata. All rights reserved.
        </div>
      </footer>
    </div>
  );
}