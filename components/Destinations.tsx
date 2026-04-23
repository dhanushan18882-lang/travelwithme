import React from 'react';
import { Destination, NavigationProps } from '../types';
import { ArrowRight } from 'lucide-react';

const destinations: Destination[] = [
  { id: 1, name: 'Sigiriya', image: '/images/sigiriya.jpg', description: 'Ancient rock fortress.', category: 'Heritage' },
  { id: 2, name: 'Ella', image: '/images/ella.jpg', description: 'Scenic hills & tea.', category: 'Nature' },
  { id: 3, name: 'Jaffna', image: '/images/jaffna.jpg', description: 'Northern culture.', category: 'Heritage' },
  { id: 4, name: 'Kandy', image: '/images/kandy.jpg', description: 'Sacred temples.', category: 'Heritage' },
];

export const Destinations: React.FC<NavigationProps> = ({ onNavigate }) => {
  return (
    <section id="destinations" className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-widest text-primary-600 uppercase mb-3">Discover</h2>
          <h3 className="font-serif text-4xl text-stone-900 font-medium">Popular Destinations</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((dest) => (
            <div key={dest.id} className="group relative h-[400px] rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-500">
              <img
                src={dest.image}
                alt={dest.name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 image-rendering-crisp"
                style={{ imageRendering: 'crisp-edges' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <div className="mb-2">
                    <span className="text-xs font-bold text-white bg-primary-600 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {dest.category}
                    </span>
                </div>
                <h4 className="text-2xl font-serif text-white mb-1">{dest.name}</h4>
                <p className="text-stone-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  {dest.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button 
            onClick={() => {
              onNavigate('destinations');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 text-stone-600 font-medium hover:text-primary-600 transition-colors border-b border-transparent hover:border-primary-600 pb-1"
          >
            Explore more destinations
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};