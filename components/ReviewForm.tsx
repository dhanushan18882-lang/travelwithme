import React, { useState } from 'react';
import { Star, Send, User, MessageSquare } from 'lucide-react';
import { Review } from '../types';

interface ReviewFormProps {
  onAddReview: (review: Review) => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ onAddReview }) => {
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !comment) return;

    setIsSubmitting(true);

    const newReview: Review = {
      id: Date.now().toString(),
      userName,
      rating,
      comment,
      date: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }),
    };

    // Simulate network delay
    setTimeout(() => {
      onAddReview(newReview);
      setUserName('');
      setRating(5);
      setComment('');
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  return (
    <section className="py-24 bg-white border-t border-stone-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl text-stone-900 mb-4">Share Your Experience</h2>
          <p className="text-stone-500">Your feedback helps us improve and helps other travelers make the best choice.</p>
        </div>

        {showSuccess ? (
          <div className="bg-green-50 text-green-700 p-8 rounded-2xl text-center border border-green-100 shadow-sm transition-all animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star size={32} fill="currentColor" />
            </div>
            <h3 className="text-xl font-bold mb-2">Thank you for your review!</h3>
            <p>Your story has been added to our collection of happy travelers.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-stone-50 rounded-3xl p-8 md:p-12 shadow-sm border border-stone-200">
            <div className="space-y-6">
              {/* Name Input */}
              <div>
                <label htmlFor="userName" className="block text-sm font-semibold text-stone-700 mb-2 flex items-center gap-2">
                  <User size={16} /> Your Full Name
                </label>
                <input
                  type="text"
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none bg-white text-stone-800"
                  placeholder="e.g. John Doe"
                  required
                />
              </div>

              {/* Rating Selector */}
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-4">
                  How would you rate our service?
                </label>
                <div className="flex gap-2 justify-center py-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star
                        size={36}
                        fill={(hoverRating || rating) >= star ? "#ca8a04" : "none"}
                        className={(hoverRating || rating) >= star ? "text-yellow-600" : "text-stone-300"}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-center text-xs text-stone-400 mt-2">
                  {rating === 5 ? "Excellent experience!" : 
                   rating === 4 ? "Great service" : 
                   rating === 3 ? "It was okay" : 
                   rating === 2 ? "Could be better" : "Disappointing"}
                </p>
              </div>

              {/* Comment Input */}
              <div>
                <label htmlFor="comment" className="block text-sm font-semibold text-stone-700 mb-2 flex items-center gap-2">
                  <MessageSquare size={16} /> Your Review
                </label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none bg-white text-stone-800 resize-none"
                  placeholder="Tell us about your trip, our drivers, and the destinations you visited..."
                  required
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-xl bg-primary-600 text-white font-bold flex items-center justify-center gap-2 transition-all hover:bg-primary-700 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-primary-200`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={18} /> Post My Review
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
