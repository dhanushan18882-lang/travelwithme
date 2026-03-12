import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import type { ContactFormData, ContactFormResponse } from "../types";

interface FormErrors {
  [key: string]: string;
}

interface FormStatus {
  loading: boolean;
  success: boolean;
  error: string | null;
}

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    destination: "",
    customDestination: "",
    message: "",
    privacyConsent: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>({
    loading: false,
    success: false,
    error: null,
  });
  const [showCustomDestination, setShowCustomDestination] = useState(false);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Handle "Other" destination option
    if (name === "destination") {
      setShowCustomDestination(value === "Other");
      if (value !== "Other") {
        setFormData((prev) => ({ ...prev, customDestination: "" }));
      }
    }
  };

  // Client-side validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }
    if (!formData.privacyConsent) {
      newErrors.privacyConsent = "You must accept the privacy policy";
    }
    if (showCustomDestination && !formData.customDestination.trim()) {
      newErrors.customDestination = "Please specify your destination";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setStatus({ loading: true, success: false, error: null });

    try {
      // Use relative URL for production (Vercel handles it)
      // For local testing, use Vercel CLI: `vercel dev`
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // Handle non-200 responses
        let errorMessage = "Failed to send message";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If JSON parsing fails, use default message
          errorMessage = `Server error: ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const data: ContactFormResponse = await response.json();

      // Success!
      setStatus({ loading: false, success: true, error: null });

      // Clear form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        destination: "",
        customDestination: "",
        message: "",
        privacyConsent: false,
      });
      setShowCustomDestination(false);

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setStatus((prev) => ({ ...prev, success: false }));
      }, 5000);
    } catch (error: any) {
      setStatus({
        loading: false,
        success: false,
        error: error.message || "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <section className="pt-32 pb-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <h2 className="text-sm font-bold tracking-widest text-primary-600 uppercase mb-3">
              Get in Touch
            </h2>
            <h1 className="font-serif text-4xl md:text-5xl text-stone-900 font-medium mb-6">
              Plan Your Dream Trip
            </h1>
            <p className="text-stone-600 text-lg mb-10 leading-relaxed">
              Ready to experience Sri Lanka? Fill out the form, and our travel
              specialists will get back to you within 24 hours with a custom
              proposal.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 text-lg">
                    Call Us
                  </h3>
                  <p className="text-stone-500">+94 76 076 3259</p>
                  <p className="text-stone-500">+94 77 267 6749</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 text-lg">
                    Email Us
                  </h3>
                  <p className="text-stone-500">travelwithmeslk@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 text-lg">
                    Visit Us
                  </h3>
                  <p className="text-stone-500">
                    No.77/7B Nagastenna rd,
                    <br />
                    Kandy, Sri Lanka
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-stone-50 p-8 md:p-10 rounded-3xl shadow-sm border border-stone-100">
            {/* Success Message */}
            {status.success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <CheckCircle
                  className="text-green-600 flex-shrink-0 mt-0.5"
                  size={20}
                />
                <div className="flex-1">
                  <p className="text-green-800 font-medium">
                    Thank you for your inquiry!
                  </p>
                  <p className="text-green-700 text-sm mt-1">
                    We'll get back to you within 24 hours.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setStatus((prev) => ({ ...prev, success: false }))
                  }
                  className="text-green-600 hover:text-green-800"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            {/* Error Message */}
            {status.error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle
                  className="text-red-600 flex-shrink-0 mt-0.5"
                  size={20}
                />
                <div className="flex-1">
                  <p className="text-red-800 font-medium">
                    Oops! Something went wrong
                  </p>
                  <p className="text-red-700 text-sm mt-1">{status.error}</p>
                </div>
                <button
                  onClick={() =>
                    setStatus((prev) => ({ ...prev, error: null }))
                  }
                  className="text-red-600 hover:text-red-800"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-stone-700 mb-2"
                  >
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.firstName ? "border-red-500" : "border-stone-300"
                      } focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all`}
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-stone-700 mb-2"
                  >
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.lastName ? "border-red-500" : "border-stone-300"
                      } focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all`}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-stone-700 mb-2"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.email ? "border-red-500" : "border-stone-300"
                    } focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all`}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-stone-700 mb-2"
                >
                  Phone Number{" "}
                  <span className="text-stone-500 text-xs">(Optional)</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  placeholder="+94 77 123 4567"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              {/* Destination */}
              <div>
                <label
                  htmlFor="destination"
                  className="block text-sm font-medium text-stone-700 mb-2"
                >
                  Interested Destination
                </label>
                <select
                  id="destination"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
                >
                  <option value="">Select a destination</option>
                  <option value="Sigiriya">Sigiriya</option>
                  <option value="Ella">Ella</option>
                  <option value="Jaffna">Jaffna</option>
                  <option value="Kandy">Kandy</option>
                  <option value="Galle Fort">Galle Fort</option>
                  <option value="Nuwara Eliya">Nuwara Eliya</option>
                  <option value="Yala National Park">Yala National Park</option>
                  <option value="Mirissa">Mirissa</option>
                  <option value="South Coast">South Coast</option>
                  <option value="Multiple Locations">Multiple Locations</option>
                  <option value="Other">Other (Please specify)</option>
                </select>
              </div>

              {/* Custom Destination */}
              {showCustomDestination && (
                <div className="animate-in fade-in duration-300">
                  <label
                    htmlFor="customDestination"
                    className="block text-sm font-medium text-stone-700 mb-2"
                  >
                    Please specify destination{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="customDestination"
                    name="customDestination"
                    value={formData.customDestination}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.customDestination
                      ? "border-red-500"
                      : "border-stone-300"
                      } focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all`}
                    placeholder="Enter your destination"
                  />
                  {errors.customDestination && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.customDestination}
                    </p>
                  )}
                </div>
              )}

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-stone-700 mb-2"
                >
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.message ? "border-red-500" : "border-stone-300"
                    } focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all`}
                  placeholder="Tell us about your travel plans, dates, and preferences..."
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                )}
              </div>

              {/* Privacy Consent */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="privacyConsent"
                    checked={formData.privacyConsent}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 rounded border-stone-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-stone-600">
                    I agree to the{" "}
                    <a
                      href="?page=privacy"
                      className="text-primary-600 hover:text-primary-700 underline"
                    >
                      Privacy Policy
                    </a>{" "}
                    and consent to the collection and use of my personal data as
                    described. <span className="text-red-500">*</span>
                  </span>
                </label>
                {errors.privacyConsent && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.privacyConsent}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status.loading}
                className="w-full bg-stone-900 text-white font-semibold py-4 rounded-lg hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status.loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send size={18} />
                  </>
                )}
              </button>

              <p className="text-xs text-stone-500 text-center">
                We typically respond within 24 hours during business days.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
