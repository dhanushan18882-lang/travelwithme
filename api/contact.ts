// Vercel Serverless Function for Contact Form Submissions
// Handles validation, rate limiting, and email notifications

import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  validateContactForm,
  sanitizeFormData,
  detectSpam,
} from "../lib/validation.js";
import {
  checkRateLimit,
  getClientIP,
  formatRemainingTime,
  getRateLimitReset,
} from "../lib/rateLimit.js";
import {
  sendOwnerNotification,
  generateSubmissionId,
  validateEmailConfig,
} from "../lib/email.js";

// Enable CORS
function setCorsHeaders(res: VercelResponse) {
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
    "http://localhost:3000",
  ];
  res.setHeader("Access-Control-Allow-Origin", allowedOrigins[0]);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  setCorsHeaders(res);

  // Handle OPTIONS request (CORS preflight)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only accept POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed. Please use POST.",
    });
  }

  try {
    // 1. Validate email configuration
    const configCheck = validateEmailConfig();
    if (!configCheck.valid) {
      console.error("❌ Email configuration error:", configCheck.error);
      return res.status(500).json({
        success: false,
        message: "Email service is not configured. Please contact support.",
      });
    }

    // 2. Get client IP address
    const clientIP = getClientIP(
      req.headers as Record<string, string | string[] | undefined>
    );
    console.log(`📥 Received submission from IP: ${clientIP}`);

    // 3. Check rate limiting
    if (!checkRateLimit(clientIP)) {
      const resetTime = getRateLimitReset(clientIP);
      const resetFormatted = formatRemainingTime(resetTime);

      console.warn(`⚠️ Rate limit exceeded for IP: ${clientIP}`);

      return res.status(429).json({
        success: false,
        message: `Too many requests. Please try again in ${resetFormatted}.`,
      });
    }

    // 4. Validate request body exists
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Request body is required.",
      });
    }

    // 5. Sanitize input data
    const sanitizedData = sanitizeFormData(req.body);

    // 6. Validate form data
    const validation = validateContactForm(sanitizedData);
    if (!validation.isValid) {
      console.warn("⚠️ Validation failed:", validation.errors);
      return res.status(400).json({
        success: false,
        message: "Please fix the errors in your form.",
        errors: validation.errors,
      });
    }

    // 7. Check for spam content
    const isSpam = detectSpam(sanitizedData.message);
    if (isSpam) {
      console.warn(`⚠️ Spam detected from IP: ${clientIP}`);
      return res.status(400).json({
        success: false,
        message:
          "Your message appears to contain spam content. Please revise and try again.",
      });
    }

    // 8. Generate unique submission ID
    const submissionId = generateSubmissionId();
    console.log(`📝 Processing submission ${submissionId}`);

    // 9. Send email notification to business owner
    await sendOwnerNotification(sanitizedData, submissionId);

    // 10. Success response
    console.log(`✅ Submission ${submissionId} processed successfully`);
    return res.status(200).json({
      success: true,
      message:
        "Thank you for your inquiry! We'll get back to you within 24 hours.",
      submissionId,
    });
  } catch (error: any) {
    // Log error details
    console.error("❌ Error processing contact form:", error);
    console.error("Error stack:", error.stack);

    // Check if it's a Web3Forms error
    if (error.message && error.message.includes("Web3Forms")) {
      return res.status(500).json({
        success: false,
        message:
          "Failed to send email. Please try again or contact us directly.",
      });
    }

    // Generic error response
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
}
