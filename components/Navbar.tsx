import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Page, NavigationProps } from '../types';

interface NavbarProps extends NavigationProps {
  currentPage: Page;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (page: Page, e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(page);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks: { name: string; page: Page }[] = [
    { name: 'Home', page: 'home' },
    { name: 'Destinations', page: 'destinations' },
    { name: 'Contact', page: 'contact' },
  ];

  // Determine navbar styles based on page and scroll
  // If not on home, always show solid background for visibility
  const showSolidNav = isScrolled || currentPage !== 'home';

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        showSolidNav ? 'bg-white/95 backdrop-blur-md shadow-md py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex justify-between items-center h-10">
          {/* Logo - Left */}
          <div className="flex-shrink-0 flex items-center z-20">
            <a 
              href="#" 
              onClick={(e) => handleNavClick('home', e)}
              className={`font-serif text-2xl font-bold tracking-tight ${showSolidNav ? 'text-primary-900' : 'text-primary-900 lg:text-white'}`}
            >
              TravelWithMe
            </a>
          </div>

          {/* Desktop Menu - Absolute Center */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={(e) => handleNavClick(link.page, e)}
<<<<<<< HEAD
                className={`text-sm font-medium transition-colors hover:text-accent ${
=======
                className={`text-base font-medium transition-colors hover:text-accent ${
>>>>>>> eae511145998e77f5a92066f5cd4016cc3781ee7
                  currentPage === link.page 
                    ? 'text-accent' 
                    : showSolidNav ? 'text-stone-600' : 'text-stone-200 hover:text-white'
                }`}
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Right Side: Contact Button & Mobile Toggle */}
          <div className="flex items-center gap-4 z-20">
            <button 
              onClick={(e) => handleNavClick('contact', e)}
<<<<<<< HEAD
              className="hidden md:block bg-stone-900 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-stone-800 transition-transform transform hover:scale-105 active:scale-95 shadow-lg"
=======
              className="hidden md:block bg-stone-900 text-white px-4 py-2 rounded-full text-base font-medium hover:bg-stone-800 transition-transform transform hover:scale-105 active:scale-95 shadow-lg"
>>>>>>> eae511145998e77f5a92066f5cd4016cc3781ee7
            >
              Contact Us
            </button>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-md ${showSolidNav ? 'text-stone-900' : 'text-white'}`}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white absolute top-full left-0 w-full shadow-xl border-t border-stone-100">
          <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col items-center">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={(e) => handleNavClick(link.page, e)}
                className={`block w-full text-center px-3 py-4 text-base font-medium hover:text-primary-600 ${
                    currentPage === link.page ? 'text-primary-600' : 'text-stone-700'
                }`}
              >
                {link.name}
              </button>
            ))}
            <button 
              onClick={(e) => handleNavClick('contact', e)}
<<<<<<< HEAD
              className="w-full mt-4 bg-primary-900 text-white px-6 py-3 rounded-lg text-base font-medium"
=======
              className="w-full mt-4 bg-primary-900 text-white px-4 py-2 rounded-lg text-base font-medium"
>>>>>>> eae511145998e77f5a92066f5cd4016cc3781ee7
            >
              Contact Us
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};