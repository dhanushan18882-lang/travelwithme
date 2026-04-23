import React from 'react';
import { ShieldCheck, Users, Car, PiggyBank } from 'lucide-react';
import { Feature } from '../types';

const features: Feature[] = [
  {
    id: 1,
    title: 'Trusted Agency',
    description: 'We are a reliable, well-reviewed service committed to providing safe and smooth travel experiences every time.',
    icon: <ShieldCheck size={40} strokeWidth={1.5} />,
  },
  {
    id: 2,
    title: 'Local Experts',
    description: 'Our drivers know the area inside out, ensuring you get the fastest routes, hidden gems, and authentic local tips.',
    icon: <Users size={40} strokeWidth={1.5} />,
  },
  {
    id: 3,
    title: 'Luxury Vehicles',
    description: 'Travel comfortably in well-maintained, spotless vehicles that are fully air-conditioned for a fresh ride.',
    icon: <Car size={40} strokeWidth={1.5} />,
  },
  {
    id: 4,
    title: 'Transparent Pricing',
    description: 'No hidden fees or surprises—just clear, upfront pricing that fits your budget without compromising on quality.',
    icon: <PiggyBank size={40} strokeWidth={1.5} />,
  },
];

export const Features: React.FC = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h3 className="font-serif text-4xl text-stone-900 font-medium">Why Choose Us</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {features.map((feature) => (
            <div key={feature.id} className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-6 transition-colors group-hover:bg-primary-600 group-hover:text-white">
                {feature.icon}
              </div>
              <h4 className="text-lg font-bold text-stone-900 mb-3">{feature.title}</h4>
              <p className="text-stone-500 text-sm leading-relaxed max-w-xs mx-auto">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
