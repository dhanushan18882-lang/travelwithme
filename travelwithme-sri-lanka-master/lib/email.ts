// Web3Forms email service for sending contact form notifications

import {
  generateOwnerEmailTemplate,
  generateOwnerEmailText,
  EmailTemplateData,
} from "./emailTemplates.js";

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
 * Sends email notification to business owner via Web3Forms
 * @param formData - Contact form submission data
 * @param submissionId - Unique submission ID
 * @returns Promise that resolves when email is sent
 */
export async function sendOwnerNotification(
  formData: ContactFormData,
  submissionId: string
): Promise<void> {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

  if (!accessKey) {
    throw new Error("Web3Forms access key is not configured");
  }

  const businessName = process.env.BUSINESS_NAME || "TravelWithMe - Sri Lanka";

  // Prepare email template data for our own record
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

  // Generate HTML version
  const htmlContent = generateOwnerEmailTemplate(templateData);

  // Prepare payload for Web3Forms
  const payload = {
    access_key: accessKey,
    subject: `🌴 New Travel Inquiry from ${formData.firstName} ${formData.lastName}`,
    from_name: businessName,
    replyto: formData.email,
    // Constructing a detailed message body for Web3Forms
    message: `
Name: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
Phone: ${formData.phone || "Not provided"}
Destination: ${formData.customDestination || formData.destination || "Not specified"}

Message:
${formData.message}

---
Submission ID: ${submissionId}
    `.trim()
  };

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (result.success) {
      console.log(`✅ Email sent successfully via Web3Forms (ID: ${submissionId})`);
    } else {
      console.error("❌ Web3Forms API error:", result);
      throw new Error(`Web3Forms failed: ${result.message}`);
    }
  } catch (error: any) {
    console.error("❌ Email sending error:", error);
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
 * Validates email configuration
 * @returns True if configured correctly
 */
export function validateEmailConfig(): { valid: boolean; error?: string } {
  if (!process.env.WEB3FORMS_ACCESS_KEY) {
    return {
      valid: false,
      error: "WEB3FORMS_ACCESS_KEY is not set in environment variables",
    };
  }

  return { valid: true };
}
