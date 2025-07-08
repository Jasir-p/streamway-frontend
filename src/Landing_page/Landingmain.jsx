import React, { useState } from 'react';
import {
  BarChart3,
  Users,
  MessageSquare,
  Target,
  ArrowRight,
  CheckCircle2,
  Phone,
  Mail,
  Building2,
  Lock,
  User,
  Briefcase,
  Shield,
  Clock,
  Globe,
  LogIn
} from 'lucide-react';
import RegistrationForm from './RegistrationForm';
import LandingFooter from './LandingFooter';
import logo1 from ".././assets/logo1.png";

function Landingmain() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with improved gradient and layout */}
      <header className="bg-gradient-to-r from-blue-700 to-indigo-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <nav className="container mx-auto px-6 py-6 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img src={logo1} className="h-12 w-auto" alt="CRM Pro Logo" />
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-white hover:text-blue-200 font-medium text-sm uppercase tracking-wide transition-colors">Features</a>
              <a href="#pricing" className="text-white hover:text-blue-200 font-medium text-sm uppercase tracking-wide transition-colors">Pricing</a>
              <a href="#contact" className="text-white hover:text-blue-200 font-medium text-sm uppercase tracking-wide transition-colors">Contact</a>
              <a href="/login" className="flex items-center text-white hover:text-blue-200 font-medium text-sm uppercase tracking-wide transition-colors">
                <LogIn className="w-4 h-4 mr-1" />
                Login
              </a>
              <a href="#register" className="bg-white text-blue-700 px-6 py-3 rounded-md font-semibold text-sm shadow-lg hover:bg-blue-50 transition-all transform hover:-translate-y-1">
                Try Free
              </a>
            </div>
            <div className="md:hidden flex items-center space-x-3">
              <a href="/login" className="text-white hover:text-blue-200 transition-colors">
                <LogIn className="w-5 h-5" />
              </a>
              <a href="#register" className="bg-white text-blue-700 px-4 py-2 rounded-md font-semibold text-sm shadow-lg">
                Try Free
              </a>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12">
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                Transform Your <span className="text-blue-200">Customer Relationships</span>
              </h1>
              <p className="mt-6 text-xl text-blue-100 leading-relaxed">
                Streamline your sales process, boost productivity, and grow your business with our powerful CRM solution.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                <a href="#register" className="bg-white text-blue-700 px-8 py-4 rounded-md font-semibold hover:bg-blue-50 transition-all transform hover:-translate-y-1 shadow-lg flex items-center justify-center">
                  Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                </a>
                <button className="border-2 border-white text-white px-8 py-4 rounded-md font-semibold hover:bg-white/10 transition-colors flex items-center justify-center">
                  Watch Demo
                </button>
              </div>
              <div className="mt-6 text-center sm:text-left">
                <p className="text-blue-100 text-sm">
                  Already have an account? 
                  <a href="/login" className="text-white hover:text-blue-200 ml-2 font-medium underline">
                    Sign in here
                  </a>
                </p>
              </div>
            </div>
            <div className="md:w-1/2 mt-12 md:mt-0">
              <div className="relative">
                <div className="absolute -inset-1 bg-blue-500 rounded-lg blur-md opacity-30"></div>
                <img 
                  src="https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&q=80"
                  alt="CRM Dashboard"
                  className="relative rounded-lg shadow-2xl border border-blue-200/20"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Curved bottom edge */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120">
            <path fill="#ffffff" fillOpacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </header>

      {/* Registration Form */}
      <section id="register">
        <RegistrationForm/>
      </section>

      {/* Redesigned Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-gray-600 text-lg">
              Our powerful CRM provides all the tools you need to manage your customer relationships effectively.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <BarChart3 className="h-10 w-10 text-blue-600" />,
                title: "Sales Analytics",
                description: "Get real-time insights into your sales performance with advanced analytics and reporting."
              },
              {
                icon: <Users className="h-10 w-10 text-blue-600" />,
                title: "Contact Management",
                description: "Organize and manage your contacts efficiently with our intuitive interface."
              },
              {
                icon: <MessageSquare className="h-10 w-10 text-blue-600" />,
                title: "Communication Tools",
                description: "Stay connected with your team and customers through integrated communication features."
              },
              {
                icon: <Target className="h-10 w-10 text-blue-600" />,
                title: "Goal Tracking",
                description: "Set and track sales goals for your team with visual progress indicators."
              },
              {
                icon: <Clock className="h-10 w-10 text-blue-600" />,
                title: "Scheduling",
                description: "Plan meetings and follow-ups with an integrated calendar and reminder system."
              },
              {
                icon: <Shield className="h-10 w-10 text-blue-600" />,
                title: "Data Security",
                description: "Keep your customer data safe with enterprise-grade security and compliance features."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-100">
                <div className="bg-blue-50 p-4 inline-block rounded-lg mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Benefits Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Why choose our CRM?
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Join thousands of businesses that have transformed their customer relationships with our powerful platform.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                {[
                  "360° view of your customers",
                  "Automated workflow processes",
                  "Advanced reporting capabilities",
                  "Seamless third-party integrations",
                  "Customizable dashboards",
                  "Mobile accessibility",
                  "Scalable for growing teams",
                  "24/7 customer support"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mr-3" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:w-1/2 mt-12 md:mt-0">
              <div className="relative">
                <div className="absolute -inset-1 bg-blue-500 rounded-lg blur opacity-20"></div>
                <img 
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80"
                  alt="Team collaboration"
                  className="relative rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section (New) */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Trusted by businesses worldwide
            </h2>
            <p className="text-gray-600 text-lg">
              See what our customers have to say about their experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "This CRM has completely transformed how we manage our sales pipeline. The intuitive interface and powerful analytics have helped us increase our closing rate by 35%.",
                name: "Sarah Johnson",
                title: "Sales Director, TechCorp"
              },
              {
                quote: "The customer support is outstanding. Whenever we've had questions, the team has been quick to respond and incredibly helpful. I couldn't recommend this platform more highly.",
                name: "Michael Chen",
                title: "CEO, Innovate Solutions"
              },
              {
                quote: "We've tried several CRM solutions, and this one stands out for its ease of use and comprehensive feature set. Our team was up and running in no time.",
                name: "Priya Patel",
                title: "Operations Manager, Global Retail"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
                <div className="flex flex-col h-full">
                  <div className="mb-6">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-6 flex-grow">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold text-gray-800">{testimonial.name}</p>
                    <p className="text-gray-600 text-sm">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Contact Section */}
      <section id="contact" className="py-24 bg-gradient-to-r from-blue-700 to-indigo-800 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to get started?
            </h2>
            <p className="text-xl text-blue-100 mb-10">
              Contact our team today and discover how we can help transform your business.
            </p>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white/10 p-8 rounded-xl backdrop-blur-sm border border-white/20">
                <Phone className="h-8 w-8 text-blue-200 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Call Us</h3>
                <a href="tel:+919995458196" className="text-blue-200 hover:text-white text-lg">
                  +91 9995458196
                </a>
              </div>
              <div className="bg-white/10 p-8 rounded-xl backdrop-blur-sm border border-white/20">
                <Mail className="h-8 w-8 text-blue-200 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Email Us</h3>
                <a href="mailto:stream8196@gmail.com" className="text-blue-200 hover:text-white text-lg">
                  stream8196@gmail.com
                </a>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="#register" className="bg-white text-blue-700 px-8 py-4 rounded-md font-semibold hover:bg-blue-50 transition-all transform hover:-translate-y-1 shadow-lg">
                Start Your Free Trial
              </a>
              <span className="text-blue-200 hidden sm:block">or</span>
              <a href="/login" className="border-2 border-white text-white px-8 py-4 rounded-md font-semibold hover:bg-white/10 transition-colors flex items-center">
                <LogIn className="w-5 h-5 mr-2" />
                Sign In
              </a>
            </div>
          </div>
        </div>
        
        {/* Curved bottom edge */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120">
            <path fill="#1e3a8a" fillOpacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Pricing Section (New) */}
      <section id="pricing" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-gray-600 text-lg">
              Choose the plan that works best for your business
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "$29",
                description: "Perfect for small teams just getting started",
                features: [
                  "Up to 1,000 contacts",
                  "Basic reporting",
                  "Email integration",
                  "5 team members",
                  "Standard support"
                ],
                isPopular: false,
                ctaText: "Start Free Trial"
              },
              {
                name: "Professional",
                price: "$79",
                description: "Ideal for growing businesses",
                features: [
                  "Up to 10,000 contacts",
                  "Advanced analytics",
                  "Email & SMS integration",
                  "Unlimited team members",
                  "Priority support",
                  "Custom dashboards",
                  "API access"
                ],
                isPopular: true,
                ctaText: "Start Free Trial"
              },
              {
                name: "Enterprise",
                price: "$199",
                description: "For large organizations with complex needs",
                features: [
                  "Unlimited contacts",
                  "Custom reporting",
                  "All integrations",
                  "Dedicated account manager",
                  "24/7 premium support",
                  "Custom development",
                  "Advanced security features"
                ],
                isPopular: false,
                ctaText: "Contact Sales"
              }
            ].map((plan, index) => (
              <div key={index} className={`bg-white rounded-xl shadow-lg border ${plan.isPopular ? 'border-blue-500 relative' : 'border-gray-100'}`}>
                {plan.isPopular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                  <div className="flex items-end mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-1">/month</span>
                  </div>
                  <p className="text-gray-600 mb-8">{plan.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <a 
                    href="#register" 
                    className={`block w-full text-center py-3 px-6 rounded-md font-semibold transition-all ${
                      plan.isPopular 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {plan.ctaText}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <LandingFooter/>
    </div>
  );
}

export default Landingmain;