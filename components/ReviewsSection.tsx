import React, { useEffect, useMemo, useState } from "react";
import { MessageSquare, Star } from "lucide-react";
import type { Review } from "../types";

const STORAGE_KEY = "travelwithme_reviews_v1";

const defaultReviews: Review[] = [
  {
    id: "seed-1",
    name: "Amara Perera",
    destination: "Ella",
    rating: 5,
    comment:
      "Everything was perfectly organized. The train ride and hotel view in Ella were unforgettable.",
    createdAt: "2026-02-18T08:30:00.000Z",
  },
  {
    id: "seed-2",
    name: "David Miller",
    destination: "Sigiriya",
    rating: 4,
    comment:
      "Great local guide and smooth transport. Would definitely book again for another region.",
    createdAt: "2026-01-22T11:00:00.000Z",
  },
  {
    id: "seed-3",
    name: "Nethmi Jayasinghe",
    destination: "Mirissa",
    rating: 5,
    comment:
      "Our whale watching tour was amazing. Communication was fast and helpful throughout.",
    createdAt: "2025-12-04T06:20:00.000Z",
  },
];

interface ReviewFormState {
  name: string;
  destination: string;
  rating: number;
  comment: string;
}

interface FormErrors {
  name?: string;
  destination?: string;
  rating?: string;
  comment?: string;
}

const initialFormState: ReviewFormState = {
  name: "",
  destination: "",
  rating: 0,
  comment: "",
};

const formatReviewDate = (isoDate: string): string => {
  return new Date(isoDate).toLocaleDateString("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const isValidReview = (value: unknown): value is Review => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Review;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.destination === "string" &&
    typeof candidate.rating === "number" &&
    candidate.rating >= 1 &&
    candidate.rating <= 5 &&
    typeof candidate.comment === "string" &&
    typeof candidate.createdAt === "string"
  );
};

export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(defaultReviews);
  const [formData, setFormData] = useState<ReviewFormState>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    try {
      const rawData = localStorage.getItem(STORAGE_KEY);

      if (!rawData) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultReviews));
        return;
      }

      const parsedData = JSON.parse(rawData) as unknown;
      if (!Array.isArray(parsedData)) {
        return;
      }

      const cleanedReviews = parsedData.filter(isValidReview);
      if (cleanedReviews.length > 0) {
        setReviews(cleanedReviews);
      }
    } catch {
      // Fall back to default reviews on malformed local data.
      setReviews(defaultReviews);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  }, [reviews]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) {
      return 0;
    }

    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / reviews.length;
  }, [reviews]);

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleRatingChange = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }));

    if (errors.rating) {
      setErrors((prev) => ({ ...prev, rating: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }

    if (formData.destination.trim().length < 2) {
      newErrors.destination = "Please enter a destination.";
    }

    if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = "Please select a rating from 1 to 5.";
    }

    if (formData.comment.trim().length < 20) {
      newErrors.comment = "Review should be at least 20 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage("");

    if (!validateForm()) {
      return;
    }

    const review: Review = {
      id: `${Date.now()}`,
      name: formData.name.trim(),
      destination: formData.destination.trim(),
      rating: formData.rating,
      comment: formData.comment.trim(),
      createdAt: new Date().toISOString(),
    };

    setReviews((prev) => [review, ...prev]);
    setFormData(initialFormState);
    setErrors({});
    setSubmitMessage("Thanks for your review. It is now visible below.");
  };

  return (
    <section className="py-24 bg-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-sm font-bold tracking-widest text-primary-600 uppercase mb-3">
            Traveler Reviews
          </h2>
          <h3 className="font-serif text-4xl md:text-5xl text-stone-900 font-medium mb-4">
            What Guests Say About Us
          </h3>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Real feedback from travelers who explored Sri Lanka with our local
            team.
          </p>
          <p className="mt-5 text-stone-700 font-medium">
            {reviews.length} reviews | Average rating: {averageRating.toFixed(1)}
            /5
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-sm h-fit">
            <div className="flex items-center gap-2 mb-4 text-stone-800">
              <MessageSquare size={18} />
              <h4 className="font-semibold text-lg">Write a Review</h4>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFieldChange}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Your full name"
                />
                {errors.name && (
                  <p className="text-red-600 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Destination
                </label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleFieldChange}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g. Kandy"
                />
                {errors.destination && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.destination}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Rating
                </label>
                <div className="flex gap-1" role="radiogroup" aria-label="Rating">
                  {[1, 2, 3, 4, 5].map((starValue) => (
                    <button
                      key={starValue}
                      type="button"
                      onClick={() => handleRatingChange(starValue)}
                      className="text-amber-500 hover:scale-110 transition-transform"
                      aria-label={`Rate ${starValue} star${starValue > 1 ? "s" : ""}`}
                    >
                      <Star
                        size={24}
                        fill={starValue <= formData.rating ? "currentColor" : "none"}
                      />
                    </button>
                  ))}
                </div>
                {errors.rating && (
                  <p className="text-red-600 text-xs mt-1">{errors.rating}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Review
                </label>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleFieldChange}
                  rows={4}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Share your travel experience"
                />
                {errors.comment && (
                  <p className="text-red-600 text-xs mt-1">{errors.comment}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-primary-600 text-white py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Submit Review
              </button>

              {submitMessage && (
                <p className="text-green-700 text-sm">{submitMessage}</p>
              )}
            </form>
          </div>

          <div className="lg:col-span-2 space-y-5">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h4 className="font-semibold text-stone-900 text-lg">
                      {review.name}
                    </h4>
                    <p className="text-sm text-stone-500">
                      {review.destination} | {formatReviewDate(review.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={`${review.id}-${index}`}
                        size={18}
                        fill={index < review.rating ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-stone-700 leading-relaxed">{review.comment}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
