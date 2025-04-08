import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';

const LandingFooter = () => {
  return (
    <div>
      <footer className="bg-gray-900 text-white pt-20 pb-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-1">
              <h3 className="text-xl font-bold mb-6 text-white">About Us</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                We provide powerful CRM solutions that help businesses of all sizes streamline their sales process and build stronger customer relationships.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="bg-gray-800 hover:bg-blue-600 p-2 rounded-full transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="bg-gray-800 hover:bg-blue-600 p-2 rounded-full transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="bg-gray-800 hover:bg-blue-600 p-2 rounded-full transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="bg-gray-800 hover:bg-blue-600 p-2 rounded-full transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-6 text-white">Product</h3>
              <ul className="space-y-3">
                <li><a href="#features" className="text-gray-400 hover:text-blue-400 transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-blue-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Security</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Updates</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-6 text-white">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Careers</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-blue-400 transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Partners</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Press</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-6 text-white">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Phone className="h-5 w-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-400">+91 9995458196</span>
                </li>
                <li className="flex items-start">
                  <Mail className="h-5 w-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-400">stream8196@gmail.com</span>
                </li>
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-400">123 Business Ave, Tech Park, Bangalore 560001</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">&copy; 2024 StreamWay. All rights reserved.</p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-blue-400 text-sm">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-blue-400 text-sm">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-blue-400 text-sm">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingFooter