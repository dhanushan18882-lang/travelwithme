// Form validation utilities for contact form

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface ContactFormInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  destination?: string;
  customDestination?: string;
  message: string;
  privacyConsent: boolean;
}

/**
 * Validates contact form data
 * @param data - Form data to validate
 * @returns Validation result with errors
 */
export function validateContactForm(data: any): ValidationResult {
  const errors: Record<string, string> = {};

  // First Name validation
  if (!data.firstName || typeof data.firstName !== "string") {
    errors.firstName = "First name is required";
  } else if (data.firstName.trim().length < 2) {
    errors.firstName = "First name must be at least 2 characters";
  } else if (data.firstName.length > 50) {
    errors.firstName = "First name must be less than 50 characters";
  } else if (!/^[a-zA-Z\s'-]+$/.test(data.firstName)) {
    errors.firstName = "First name contains invalid characters";
  }

  // Last Name validation
  if (!data.lastName || typeof data.lastName !== "string") {
    errors.lastName = "Last name is required";
  } else if (data.lastName.trim().length < 2) {
    errors.lastName = "Last name must be at least 2 characters";
  } else if (data.lastName.length > 50) {
    errors.lastName = "Last name must be less than 50 characters";
  } else if (!/^[a-zA-Z\s'-]+$/.test(data.lastName)) {
    errors.lastName = "Last name contains invalid characters";
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || typeof data.email !== "string") {
    errors.email = "Email address is required";
  } else if (!emailRegex.test(data.email)) {
    errors.email = "Please provide a valid email address";
  } else if (data.email.length > 100) {
    errors.email = "Email address is too long";
  }

  // Phone validation (optional field)
  if (data.phone && data.phone.trim() !== "") {
    // Remove common phone number characters for validation
    const cleanPhone = data.phone.replace(/[\s\-\(\)\+]/g, "");

    if (cleanPhone.length < 7) {
      errors.phone = "Phone number is too short";
    } else if (cleanPhone.length > 15) {
      errors.phone = "Phone number is too long";
    } else if (!/^[0-9]+$/.test(cleanPhone)) {
      errors.phone = "Phone number should contain only digits";
    }
  }

  // Destination validation
  const validDestinations = [
    "Sigiriya",
    "Ella",
    "Jaffna",
    "Kandy",
    "Galle Fort",
    "Nuwara Eliya",
    "Yala National Park",
    "Mirissa",
    "Polonnaruwa",
    "Anuradhapura",
    "Trincomalee",
    "Arugam Bay",
    "Horton Plains",
    "Sinharaja Forest",
    "Bentota",
    "Adam's Peak",
    "South Coast",
    "Multiple Locations",
    "Other",
  ];

  if (data.destination && !validDestinations.includes(data.destination)) {
    errors.destination = "Please select a valid destination";
  }

  // Custom destination validation (if "Other" is selected)
  if (data.destination === "Other") {
    if (!data.customDestination || data.customDestination.trim() === "") {
      errors.customDestination = "Please specify your destination";
    } else if (data.customDestination.length > 100) {
      errors.customDestination = "Destination name is too long";
    }
  }

  // Message validation
  if (!data.message || typeof data.message !== "string") {
    errors.message = "Message is required";
  } else if (data.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters";
  } else if (data.message.length > 1000) {
    errors.message = "Message must be less than 1000 characters";
  }

  // Privacy consent validation (GDPR requirement)
  if (!data.privacyConsent || data.privacyConsent !== true) {
    errors.privacyConsent = "You must accept the privacy policy to continue";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Sanitizes string input to prevent XSS attacks
 * @param input - String to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== "string") return "";

  return input
    .trim()
    .replace(/[<>]/g, "") // Remove < and > to prevent HTML injection
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, ""); // Remove event handlers like onclick=
}

/**
 * Sanitizes all form data
 * @param data - Form data to sanitize
 * @returns Sanitized form data
 */
export function sanitizeFormData(data: ContactFormInput): ContactFormInput {
  return {
    firstName: sanitizeInput(data.firstName),
    lastName: sanitizeInput(data.lastName),
    email: sanitizeInput(data.email),
    phone: data.phone ? sanitizeInput(data.phone) : undefined,
    destination: data.destination ? sanitizeInput(data.destination) : undefined,
    customDestination: data.customDestination
      ? sanitizeInput(data.customDestination)
      : undefined,
    message: sanitizeInput(data.message),
    privacyConsent: data.privacyConsent,
  };
}

/**
 * Checks if input contains spam-like content
 * @param text - Text to check
 * @returns True if spam detected
 */
export function detectSpam(text: string): boolean {
  const spamKeywords = [
    "viagra",
    "cialis",
    "casino",
    "lottery",
    "prize",
    "winner",
    "click here",
    "buy now",
    "limited time",
    "act now",
    "free money",
    "make money fast",
    "work from home",
  ];

  const lowerText = text.toLowerCase();

  // Check for spam keywords
  const hasSpamKeywords = spamKeywords.some((keyword) =>
    lowerText.includes(keyword)
  );

  // Check for excessive links (more than 3 URLs)
  const urlCount = (text.match(/https?:\/\//g) || []).length;
  const hasExcessiveLinks = urlCount > 3;

  // Check for excessive capitalization (more than 50% caps)
  const capsCount = (text.match(/[A-Z]/g) || []).length;
  const capsRatio = capsCount / text.length;
  const hasExcessiveCaps = capsRatio > 0.5 && text.length > 20;

  return hasSpamKeywords || hasExcessiveLinks || hasExcessiveCaps;
}
