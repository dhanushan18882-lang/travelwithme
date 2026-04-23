import React from 'react';
import { Instagram, Facebook, Youtube } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-50 border-t border-stone-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Social Icons */}
        <div className="flex justify-center space-x-8 mb-8">
          <a href="#" className="text-stone-900 hover:text-accent transition-colors">
            <Instagram size={28} strokeWidth={1.5} />
          </a>
          <a href="#" className="text-stone-900 hover:text-accent transition-colors">
            <Facebook size={28} strokeWidth={1.5} />
          </a>
          <a href="#" className="text-stone-900 hover:text-accent transition-colors">
            <Youtube size={28} strokeWidth={1.5} />
          </a>
        </div>

        {/* Logo/Brand */}
        <div className="mb-6">
          <h2 className="font-serif text-2xl font-bold text-stone-900">TravelWithMe</h2>
        </div>

        {/* Navigation */}
        <div className="flex justify-center space-x-8 mb-8 text-sm font-medium text-stone-600">
          <a href="#" className="hover:text-stone-900">Home</a>
          <a href="#destinations" className="hover:text-stone-900">Destinations</a>
          <a href="#gallery" className="hover:text-stone-900">Gallery</a>
        </div>

        {/* Copyright */}
        <div className="text-xs text-stone-400">
          <p>© 2025 TravelWithMe. Copyright and All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
