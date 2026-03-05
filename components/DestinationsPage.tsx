import React, { useState } from 'react';
import { Destination, NavigationProps } from '../types';
import { MapPin, ArrowRight } from 'lucide-react';

const allDestinations: Destination[] = [
  { id: 1, name: 'Sigiriya', image: '/images/sigiriya.jpg', category: 'Heritage', description: 'Explore the ancient rock fortress, a UNESCO World Heritage site known for its frescoes and mirror wall.' },
  { id: 2, name: 'Ella', image: '/images/ella.jpg', category: 'Nature', description: 'Immerse yourself in the scenic hill country, famous for the Nine Arch Bridge, hiking trails, and lush tea plantations.' },
  { id: 3, name: 'Jaffna', image: '/images/jaffna.jpg', category: 'Heritage', description: 'Experience the unique culture of the North, visiting colorful Hindu temples, the historic fort, and secluded islands.' },
  { id: 4, name: 'Kandy', image: '/images/kandy.jpg', category: 'Heritage', description: 'Visit the cultural capital, home to the Temple of the Sacred Tooth Relic and beautiful botanical gardens.' },
  { id: 5, name: 'Galle Fort', image: '/images/galle-fort.jpg', category: 'Heritage', description: 'Wander through the cobblestone streets of this historic Dutch colonial fort, lined with cafes and boutiques.' },
  { id: 6, name: 'Nuwara Eliya', image: '/images/nuwara-eliya.jpg', category: 'Nature', description: 'Known as "Little England," enjoy cool climates, colonial architecture, and endless green tea estates.' },
  { id: 7, name: 'Yala National Park', image: '/images/yala.jpg', category: 'Wildlife', description: 'Go on a safari to spot leopards, elephants, and diverse birdlife in Sri Lanka\'s most popular wildlife park.' },
  { id: 8, name: 'Mirissa', image: '/images/mirissa.jpg', category: 'Beaches', description: 'Relax on golden sandy beaches and embark on a whale-watching tour to see the magnificent Blue Whales.' },
  { id: 9, name: 'Polonnaruwa', image: '/images/polonnaruwa.jpg', category: 'Heritage', description: 'Step back in time at this ancient kingdom featuring well-preserved stupas, statues, and royal palaces.' },
  { id: 10, name: 'Anuradhapura', image: '/images/anuradhapura.jpg', category: 'Heritage', description: 'Discover the ruins of the first capital of Sri Lanka, home to one of the oldest living trees in the world.' },
  { id: 11, name: 'Trincomalee', image: '/images/trincomalee.jpg', category: 'Beaches', description: 'Visit the east coast for pristine white sandy beaches, the Koneswaram Temple, and Pigeon Island snorkeling.' },
  { id: 12, name: 'Arugam Bay', image: '/images/arugam-bay.jpg', category: 'Beaches', description: 'A world-renowned surfing destination on the east coast with a laid-back vibe and excellent waves.' },
  { id: 13, name: 'Horton Plains', image: '/images/horton-plains.jpg', category: 'Nature', description: 'Trek through cloud forests to "World\'s End", a sheer cliff with breathtaking views of the southern plains.' },
  { id: 14, name: 'Sinharaja Forest', image: '/images/sinharaja.jpg', category: 'Nature', description: 'Explore this UNESCO Biosphere Reserve, a biodiversity hotspot teeming with endemic flora and fauna.' },
  { id: 15, name: 'Bentota', image: '/images/bentota.jpg', category: 'Beaches', description: 'The prime destination for water sports, luxury resorts, and a relaxing river safari among the mangroves.' },
  { id: 16, name: 'Adam\'s Peak', image: '/images/adams-peak.jpg', category: 'Nature', description: 'Climb this sacred mountain at sunrise, a pilgrimage site revered by multiple religions for the "Sacred Footprint".' },
];

const categories = ["All", "Heritage", "Nature", "Beaches", "Wildlife"];

export const DestinationsPage: React.FC<NavigationProps> = ({ onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredDestinations = activeCategory === "All" 
    ? allDestinations 
    : allDestinations.filter(d => d.category === activeCategory);

  return (
    <section className="pt-32 pb-24 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-sm font-bold tracking-widest text-primary-600 uppercase mb-3">Explore Sri Lanka</h2>
          <h1 className="font-serif text-4xl md:text-5xl text-stone-900 font-medium mb-6">Top Destinations</h1>
          <p className="max-w-2xl mx-auto text-stone-600 text-lg">
            From misty mountains to golden beaches, discover the diverse beauty of our island paradise. 
            Select a destination to start planning your custom itinerary.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${
                activeCategory === category
                  ? 'bg-primary-600 text-white border-primary-600 shadow-lg scale-105'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-primary-400 hover:text-primary-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredDestinations.map((dest) => (
            <div key={dest.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group animate-in fade-in zoom-in duration-500">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 text-xs font-semibold text-primary-800 shadow-sm">
                  <MapPin size={12} />
                  {dest.category}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-serif text-2xl text-stone-900 mb-3 group-hover:text-primary-700 transition-colors">
                  {dest.name}
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed mb-6 flex-grow">
                  {dest.description}
                </p>
                
                <button 
                  onClick={() => onNavigate('contact')}
                  className="w-full mt-auto bg-stone-100 hover:bg-primary-600 hover:text-white text-stone-900 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 group/btn"
                >
                  Book This Tour
                  <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {filteredDestinations.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-xl font-medium text-stone-400">No destinations found in this category.</h3>
          </div>
        )}
        
        <div className="mt-20 bg-primary-900 rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden">
            <div className="relative z-10">
                <h3 className="font-serif text-3xl md:text-4xl font-medium mb-4">Can't decide where to go?</h3>
                <p className="text-primary-100 mb-8 max-w-xl mx-auto">
                    Let our local experts craft a personalized itinerary just for you based on your interests and budget.
                </p>
                <button 
                    onClick={() => onNavigate('contact')}
                    className="bg-white text-primary-900 px-8 py-3 rounded-full font-semibold hover:bg-primary-50 transition-colors shadow-lg"
                >
                    Contact Our Experts
                </button>
            </div>
            {/* Decorative circles */}
            <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-800 rounded-full opacity-50"></div>
            <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-64 h-64 bg-primary-500 rounded-full opacity-20"></div>
        </div>
      </div>
    </section>
  );
};