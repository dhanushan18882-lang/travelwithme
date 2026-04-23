import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ImagePlus,
  Lock,
  MapPin,
  MessageSquare,
  PencilLine,
  Star,
  Upload,
  User,
  X,
} from "lucide-react";
import type { Review } from "../types";

const STORAGE_KEY = "travelwithme_reviews_v1";
const MAX_REVIEW_LENGTH = 500;
const MAX_PHOTOS = 3;

const destinationOptions = [
  "Ella",
  "Kandy",
  "Sigiriya",
  "Mirissa",
  "Yala National Park",
  "Galle Fort",
  "Nuwara Eliya",
  "Arugam Bay",
  "Custom",
];

const quickTags = [
  "Great Guide",
  "Smooth Travel",
  "Clean Hotels",
  "Value for Money",
  "Would Recommend",
];

const defaultReviews: Review[] = [
  {
    id: "seed-1",
    name: "Amara Perera",
    destination: "Ella",
    rating: 5,
    comment:
      "Everything was perfectly organized. The train ride and hotel view in Ella were unforgettable.",
    createdAt: "2026-02-18T08:30:00.000Z",
    quickTags: ["Great Guide", "Would Recommend"],
  },
  {
    id: "seed-2",
    name: "David Miller",
    destination: "Sigiriya",
    rating: 4,
    comment:
      "Great local guide and smooth transport. Would definitely book again for another region.",
    createdAt: "2026-01-22T11:00:00.000Z",
    quickTags: ["Smooth Travel", "Value for Money"],
  },
  {
    id: "seed-3",
    name: "Nethmi Jayasinghe",
    destination: "Mirissa",
    rating: 5,
    comment:
      "Our whale watching tour was amazing. Communication was fast and helpful throughout.",
    createdAt: "2025-12-04T06:20:00.000Z",
    quickTags: ["Would Recommend"],
  },
];

interface ReviewFormState {
  name: string;
  destination: string;
  rating: number;
  comment: string;
  quickTags: string[];
  photos: File[];
}

interface FormErrors {
  name?: string;
  destination?: string;
  rating?: string;
  comment?: string;
  photos?: string;
}

const initialFormState: ReviewFormState = {
  name: "",
  destination: "",
  rating: 0,
  comment: "",
  quickTags: [],
  photos: [],
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
    typeof candidate.createdAt === "string" &&
    (!candidate.quickTags || Array.isArray(candidate.quickTags))
  );
};

export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(defaultReviews);
  const [formData, setFormData] = useState<ReviewFormState>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitMessage, setSubmitMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name } = e.target;
    const value =
      name === "comment"
        ? e.target.value.slice(0, MAX_REVIEW_LENGTH)
        : e.target.value;

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

  const toggleTag = (tag: string) => {
    setFormData((prev) => {
      const exists = prev.quickTags.includes(tag);
      const nextTags = exists
        ? prev.quickTags.filter((item) => item !== tag)
        : [...prev.quickTags, tag];

      return { ...prev, quickTags: nextTags };
    });
  };

  const addPhotos = (files: FileList | File[]) => {
    const selected = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    setFormData((prev) => {
      const merged = [...prev.photos, ...selected].slice(0, MAX_PHOTOS);
      return { ...prev, photos: merged };
    });

    if (errors.photos) {
      setErrors((prev) => ({ ...prev, photos: undefined }));
    }
  };

  const removePhoto = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, index) => index !== indexToRemove),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }

    if (formData.destination.trim().length < 2) {
      newErrors.destination = "Please choose a destination.";
    }

    if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = "Please select a rating from 1 to 5.";
    }

    if (formData.comment.trim().length < 20) {
      newErrors.comment = "Review should be at least 20 characters.";
    }

    if (formData.photos.length > MAX_PHOTOS) {
      newErrors.photos = `You can upload up to ${MAX_PHOTOS} images.`;
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
      quickTags: formData.quickTags,
    };

    setReviews((prev) => [review, ...prev]);
    setFormData(initialFormState);
    setErrors({});
    setSubmitMessage("Thanks for your review. It is now visible below.");
  };

  return (
    <section className="py-24 bg-stone-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-sm font-bold tracking-widest text-primary-600 uppercase mb-3">
            Traveler Reviews
          </h2>
          <h3 className="font-serif text-4xl md:text-5xl text-stone-900 font-medium mb-4">
            Share Your Experience
          </h3>
          <p className="text-stone-600 max-w-2xl mx-auto">
            {reviews.length} reviews collected | Average rating {averageRating.toFixed(
              1
            )}
            /5
          </p>
        </div>

        <div className="bg-stone-100 border border-stone-300/70 rounded-2xl p-6 md:p-10 shadow-sm">
          <div className="flex items-start gap-3 mb-8">
            <MessageSquare className="text-stone-700 mt-0.5" size={22} />
            <div>
              <h4 className="font-semibold text-3xl text-stone-900 leading-tight">
                Write a Review
              </h4>
              <p className="text-stone-600 mt-1">
                Share your experience and help other travelers.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-stone-800 mb-2">
                  Your Name
                </label>
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500"
                  />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFieldChange}
                    className="w-full rounded-lg border border-stone-400/70 bg-white pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-stone-400"
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-700 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-800 mb-2">
                  Destination
                </label>
                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500"
                  />
                  <select
                    name="destination"
                    value={formData.destination}
                    onChange={handleFieldChange}
                    className="w-full appearance-none rounded-lg border border-stone-400/70 bg-white pl-10 pr-9 py-2.5 focus:outline-none focus:ring-2 focus:ring-stone-400 text-stone-700"
                  >
                    <option value="">e.g. Ella, Kandy</option>
                    {destinationOptions.map((destination) => (
                      <option key={destination} value={destination}>
                        {destination}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.destination && (
                  <p className="text-red-700 text-xs mt-1">
                    {errors.destination}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-800 mb-2">
                Overall Rating
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {[1, 2, 3, 4, 5].map((starValue) => (
                  <button
                    key={starValue}
                    type="button"
                    onClick={() => handleRatingChange(starValue)}
                    className="text-stone-400 hover:text-amber-500 transition-colors"
                    aria-label={`Rate ${starValue} star${starValue > 1 ? "s" : ""}`}
                  >
                    <Star
                      size={34}
                      strokeWidth={1.8}
                      fill={starValue <= formData.rating ? "currentColor" : "none"}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-stone-600">
                  {formData.rating > 0
                    ? `${formData.rating} of 5 selected`
                    : "Select your rating"}
                </span>
              </div>
              {errors.rating && (
                <p className="text-red-700 text-xs mt-1">{errors.rating}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-800 mb-2">
                Your Review
              </label>
              <div className="relative">
                <PencilLine
                  size={18}
                  className="absolute left-3 top-3 text-stone-500"
                />
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleFieldChange}
                  rows={6}
                  className="w-full rounded-lg border border-stone-400/70 bg-white pl-10 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-stone-400"
                  placeholder="Share your travel experience..."
                />
                <div className="absolute right-3 bottom-3 text-sm text-stone-600">
                  {formData.comment.length} / {MAX_REVIEW_LENGTH}
                </div>
              </div>
              {errors.comment && (
                <p className="text-red-700 text-xs mt-1">{errors.comment}</p>
              )}
            </div>

            <div>
              <p className="block text-sm font-semibold text-stone-800 mb-2">
                Quick Tags <span className="font-normal text-stone-600">(optional)</span>
              </p>
              <div className="flex flex-wrap gap-3">
                {quickTags.map((tag) => {
                  const isSelected = formData.quickTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        isSelected
                          ? "bg-stone-800 text-white border-stone-800"
                          : "bg-white text-stone-800 border-stone-400/70 hover:bg-stone-200"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="block text-sm font-semibold text-stone-800 mb-2">
                Add Photos <span className="font-normal text-stone-600">(optional)</span>
              </p>
              <div
                onDragEnter={(event) => {
                  event.preventDefault();
                  setDragActive(true);
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={(event) => {
                  event.preventDefault();
                  setDragActive(false);
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  setDragActive(false);
                  addPhotos(event.dataTransfer.files);
                }}
                className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
                  dragActive
                    ? "border-stone-500 bg-stone-200/60"
                    : "border-stone-400/70 bg-stone-50"
                }`}
              >
                <ImagePlus size={34} className="mx-auto text-stone-500 mb-3" />
                <p className="text-stone-700">Drag and drop images here</p>
                <p className="text-stone-600 text-sm my-1">or</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-stone-400 rounded-lg bg-white hover:bg-stone-100 transition-colors"
                >
                  <Upload size={16} />
                  Upload Photos
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => {
                    if (event.target.files) {
                      addPhotos(event.target.files);
                      event.target.value = "";
                    }
                  }}
                  className="hidden"
                />
                <p className="text-xs text-stone-500 mt-3">
                  Up to {MAX_PHOTOS} images.
                </p>
              </div>

              {formData.photos.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.photos.map((photo, index) => (
                    <span
                      key={`${photo.name}-${index}`}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-stone-300 text-xs text-stone-700"
                    >
                      {photo.name}
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        aria-label="Remove photo"
                        className="text-stone-500 hover:text-stone-800"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {errors.photos && (
                <p className="text-red-700 text-xs mt-2">{errors.photos}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-stone-700 text-white py-3 rounded-lg text-lg font-semibold hover:bg-stone-800 transition-colors"
            >
              Submit Review
            </button>

            <div className="flex items-center justify-center gap-2 text-stone-600 text-sm">
              <Lock size={15} />
              <p>Your review will be public and help other travelers.</p>
            </div>

            {submitMessage && (
              <p className="text-green-700 text-sm text-center">{submitMessage}</p>
            )}
          </form>
        </div>

        <div className="mt-10 space-y-4">
          <h4 className="font-semibold text-stone-900 text-2xl">Recent Reviews</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.slice(0, 4).map((review) => (
              <article
                key={review.id}
                className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h5 className="font-semibold text-stone-900">{review.name}</h5>
                    <p className="text-xs text-stone-500">
                      {review.destination} | {formatReviewDate(review.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={`${review.id}-${index}`}
                        size={16}
                        fill={index < review.rating ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-stone-700 text-sm leading-relaxed mb-3">
                  {review.comment}
                </p>

                {review.quickTags && review.quickTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {review.quickTags.map((tag) => (
                      <span
                        key={`${review.id}-${tag}`}
                        className="text-xs px-2.5 py-1 rounded-full bg-stone-100 text-stone-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
