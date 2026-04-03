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
import { ReviewsSection } from './components/ReviewsSection';
import { ReviewForm } from './components/ReviewForm';
import { Page, Review } from './types';

const INITIAL_REVIEWS: Review[] = [
  {
    id: '1',
    userName: 'Sarah Jenkins',
    rating: 5,
    comment: 'Our trip to Ella was magical! The driver was so professional and knew all the best spots for photos. Highly recommend "Travel With Me"!',
    date: 'March 15, 2026',
  },
  {
    id: '2',
    userName: 'Mark Thompson',
    rating: 5,
    comment: 'Very reliable service. The vehicle was clean and comfortable for our long journey to Sigiriya. Will definitely use them again.',
    date: 'February 28, 2026',
  },
  {
    id: '3',
    userName: 'Elena Rodriguez',
    rating: 4,
    comment: 'Great experience exploring the south coast. The guide was very friendly and shared some really interesting local history.',
    date: 'January 10, 2026',
  }
];

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [reviews, setReviews] = useState<Review[]>([]);

  // Load reviews from localStorage on mount
  useEffect(() => {
    const savedReviews = localStorage.getItem('travelwithme_reviews');
    if (savedReviews) {
      try {
        setReviews(JSON.parse(savedReviews));
      } catch (e) {
        console.error("Failed to parse saved reviews", e);
        setReviews(INITIAL_REVIEWS);
      }
    } else {
      setReviews(INITIAL_REVIEWS);
      localStorage.setItem('travelwithme_reviews', JSON.stringify(INITIAL_REVIEWS));
    }

    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get('page');
    if (pageParam === 'privacy') {
      setCurrentPage('privacy');
    }
  }, []);

  const handleAddReview = (newReview: Review) => {
    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem('travelwithme_reviews', JSON.stringify(updatedReviews));
  };

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    // If navigating via internal state, clear the query param to avoid confusion on refresh
    if (window.location.search.includes('page=privacy')) {
      window.history.pushState({}, '', window.location.pathname);
    }
    // Scroll to top on navigation
    window.scrollTo(0, 0);
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
            <ReviewsSection reviews={reviews} />
            <Gallery />
            <ReviewForm onAddReview={handleAddReview} />
          </>
        )}

        {currentPage === 'destinations' && (
          <DestinationsPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'contact' && (
          <ContactPage onNavigate={handleNavigate} />
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