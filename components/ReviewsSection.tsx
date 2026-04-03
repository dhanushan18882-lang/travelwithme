import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Review } from '../types';

interface ReviewsSectionProps {
  reviews: Review[];
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (reviews.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  if (reviews.length === 0) return null;

  const currentReview = reviews[currentIndex];

  return (
    <section className="py-24 bg-stone-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl text-stone-900 mb-4">What Our Travelers Say</h2>
          <div className="w-20 h-1 bg-primary-600 mx-auto rounded-full"></div>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Quote Icon Background */}
          <div className="absolute -top-10 -left-10 text-stone-200 pointer-events-none">
            <Quote size={120} fill="currentColor" />
          </div>

          {/* Carousel Content */}
          <div className="relative bg-white rounded-3xl shadow-xl p-8 md:p-12 transition-all duration-500 ease-in-out">
            <div className="flex flex-col items-center text-center">
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    fill={i < currentReview.rating ? "#ca8a04" : "none"}
                    className={i < currentReview.rating ? "text-yellow-600" : "text-stone-300"}
                  />
                ))}
              </div>

              {/* Comment */}
              <blockquote className="text-xl md:text-2xl text-stone-700 italic leading-relaxed mb-8">
                "{currentReview.comment}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                {currentReview.avatar ? (
                  <img
                    src={currentReview.avatar}
                    alt={currentReview.userName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-lg">
                    {currentReview.userName.charAt(0)}
                  </div>
                )}
                <div className="text-left">
                  <h4 className="font-bold text-stone-900">{currentReview.userName}</h4>
                  <p className="text-sm text-stone-500">{currentReview.date}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          {reviews.length > 1 && (
            <>
              <button
                onClick={prevReview}
                className="absolute top-1/2 -left-4 md:-left-12 -translate-y-1/2 p-3 rounded-full bg-white shadow-lg text-stone-600 hover:text-primary-600 transition-colors z-10"
                aria-label="Previous review"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextReview}
                className="absolute top-1/2 -right-4 md:-right-12 -translate-y-1/2 p-3 rounded-full bg-white shadow-lg text-stone-600 hover:text-primary-600 transition-colors z-10"
                aria-label="Next review"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Pagination Dots */}
          <div className="flex justify-center mt-10 gap-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'w-8 bg-primary-600' : 'bg-stone-300'
                }`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
