import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Destinations } from './components/Destinations';
import { Features } from './components/Features';
import { Gallery } from './components/Gallery';
import { Footer } from './components/Footer';
import { DestinationsPage } from './components/DestinationsPage';
import { ContactPage } from './components/ContactPage';
import { Page } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen font-sans selection:bg-primary-200 selection:text-primary-900">
      <Navbar onNavigate={handleNavigate}       cd "c:\Users\dhanu\OneDrive\Desktop\travelwithme-sri-lanka-master\travelwithme-sri-lanka-master"
      git add .
      git commit -m "Force redeploy"
      git push origin main      cd "c:\Users\dhanu\OneDrive\Desktop\travelwithme-sri-lanka-master\travelwithme-sri-lanka-master"
      git add .
      git commit -m "Force redeploy"
      git push origin main      cd "c:\Users\dhanu\OneDrive\Desktop\travelwithme-sri-lanka-master\travelwithme-sri-lanka-master"
      git add .
      git commit -m "Force redeploy"
      git push origin maincurrentPage={currentPage} />
      <main>
        {currentPage === 'home' && (
          <>
            <Hero onNavigate={handleNavigate} />
            <Destinations onNavigate={handleNavigate} />
            <Features />
            <Gallery />
          </>
        )}
        
        {currentPage === 'destinations' && (
          <DestinationsPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'contact' && (
          <ContactPage />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;