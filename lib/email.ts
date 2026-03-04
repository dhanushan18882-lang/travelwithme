// SendGrid email service for sending contact form notifications

import sgMail from "@sendgrid/mail";
import {
  generateOwnerEmailTemplate,
  generateOwnerEmailText,
  EmailTemplateData,
} from "./emailTemplates";

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  destination?: string;
  customDestination?: string;
  message: string;
}

/**
 * Sends email notification to business owner
 * @param formData - Contact form submission data
 * @param submissionId - Unique submission ID
 * @returns Promise that resolves when email is sent
 */
export async function sendOwnerNotification(
  formData: ContactFormData,
  submissionId: string
): Promise<void> {
  if (!process.env.SENDGRID_API_KEY) {
    throw new Error("SendGrid API key is not configured");
  }

  if (!process.env.BUSINESS_EMAIL) {
    throw new Error("Business email is not configured");
  }

  const businessEmail = process.env.BUSINESS_EMAIL;
  const businessName = process.env.BUSINESS_NAME || "TravelWithMe - Sri Lanka";

  // Prepare email template data
  const templateData: EmailTemplateData = {
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: formData.phone,
    destination: formData.destination,
    customDestination: formData.customDestination,
    message: formData.message,
    timestamp: new Date().toLocaleString("en-US", {
      timeZone: "Asia/Colombo",
      dateStyle: "full",
      timeStyle: "long",
    }),
    submissionId,
  };

  // Generate HTML and text versions
  const htmlContent = generateOwnerEmailTemplate(templateData);
  const textContent = generateOwnerEmailText(templateData);

  // Prepare email message
  const msg = {
    to: businessEmail,
    from: {
      email: businessEmail,
      name: businessName,
    },
    subject: `🌴 New Travel Inquiry from ${formData.firstName} ${formData.lastName}`,
    text: textContent,
    html: htmlContent,
    priority: "high" as const, // Mark as high priority
    headers: {
      "X-Priority": "1",
      "X-MSMail-Priority": "High",
      Importance: "high",
    },
    categories: ["contact-form", "high-priority"],
    customArgs: {
      submission_id: submissionId,
      source: "contact-form",
    },
  };

  try {
    await sgMail.send(msg);
    console.log(
      `✅ Email sent successfully to ${businessEmail} (ID: ${submissionId})`
    );
  } catch (error: any) {
    console.error("❌ SendGrid error:", error);

    if (error.response) {
      console.error("SendGrid response:", error.response.body);
    }

    throw new Error("Failed to send email notification");
  }
}

/**
 * Generates a unique submission ID
 * @returns Unique ID string
 */
export function generateSubmissionId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `sub_${timestamp}_${random}`;
}

/**
 * Validates SendGrid configuration
 * @returns True if configured correctly
 */
export function validateEmailConfig(): { valid: boolean; error?: string } {
  console.log("env:", {
    key: process.env.SENDGRID_API_KEY,
    email: process.env.BUSINESS_EMAIL,
  });
  if (!process.env.SENDGRID_API_KEY) {
    return {
      valid: false,
      error: "SENDGRID_API_KEY is not set in environment variables",
    };
  }

  if (!process.env.BUSINESS_EMAIL) {
    return {
      valid: false,
      error: "BUSINESS_EMAIL is not set in environment variables",
    };
  }

  // Check if API key has correct format
  if (!process.env.SENDGRID_API_KEY.startsWith("SG.")) {
    return {
      valid: false,
      error: 'SENDGRID_API_KEY appears to be invalid (should start with "SG.")',
    };
  }

  return { valid: true };
}
