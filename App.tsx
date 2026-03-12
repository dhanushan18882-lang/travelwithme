import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Destinations } from './components/Destinations';
import { Features } from './components/Features';
import { Gallery } from './components/Gallery';
import { Footer } from './components/Footer';
import { DestinationsPage } from './components/DestinationsPage';
import { ContactPage } from './components/ContactPage';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { Page } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get('page');
    if (pageParam === 'privacy') {
      setCurrentPage('privacy');
    }
  }, []);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    // If navigating via internal state, clear the query param to avoid confusion on refresh
    if (window.location.search.includes('page=privacy')) {
      window.history.pushState({}, '', window.location.pathname);
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-primary-200 selection:text-primary-900">
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />
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

        {currentPage === 'privacy' && (
          <PrivacyPolicy onNavigate={handleNavigate} />
        )}
      </main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default App;