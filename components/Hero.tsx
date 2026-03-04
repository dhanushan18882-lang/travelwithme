import React from 'react';
import { NavigationProps } from '../types';

export const Hero: React.FC<NavigationProps> = ({ onNavigate }) => {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
<<<<<<< HEAD
          src="https://picsum.photos/id/1015/1920/1080" 
          alt="Sri Lanka landscape"
          className="w-full h-full object-cover"
=======
          src="/images/hero.jpg"
          alt="Sri Lanka landscape"
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
>>>>>>> eae511145998e77f5a92066f5cd4016cc3781ee7
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-stone-50"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center mt-16">
        <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg leading-tight">
          Your Sri Lankan Tour Guide <br />
          <span className="text-primary-100 italic">to Culture, Nature & Adventure</span>
        </h1>
        
        <p className="text-lg md:text-xl text-stone-100 mb-10 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md">
          Discover the pearl of the Indian Ocean with curated experiences designed just for you. From pristine beaches to ancient temples.
        </p>

        <button
          onClick={() => {
            onNavigate('destinations');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-block bg-stone-200/90 hover:bg-stone-100 text-stone-900 px-8 py-3 rounded-md text-lg font-semibold transition-all shadow-lg backdrop-blur-sm"
        >
          Find a destination
        </button>
      </div>
    </section>
  );
};