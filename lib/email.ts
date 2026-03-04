<<<<<<< HEAD
// SendGrid email service for sending contact form notifications

import sgMail from "@sendgrid/mail";
=======
// Web3Forms email service for sending contact form notifications

>>>>>>> eae511145998e77f5a92066f5cd4016cc3781ee7
import {
  generateOwnerEmailTemplate,
  generateOwnerEmailText,
  EmailTemplateData,
<<<<<<< HEAD
} from "./emailTemplates";

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}
=======
} from "./emailTemplates.js";
>>>>>>> eae511145998e77f5a92066f5cd4016cc3781ee7

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
<<<<<<< HEAD
 * Sends email notification to business owner
=======
 * Sends email notification to business owner via Web3Forms
>>>>>>> eae511145998e77f5a92066f5cd4016cc3781ee7
 * @param formData - Contact form submission data
 * @param submissionId - Unique submission ID
 * @returns Promise that resolves when email is sent
 */
export async function sendOwnerNotification(
  formData: ContactFormData,
  submissionId: string
): Promise<void> {
<<<<<<< HEAD
  if (!process.env.SENDGRID_API_KEY) {
    throw new Error("SendGrid API key is not configured");
  }

  if (!process.env.BUSINESS_EMAIL) {
    throw new Error("Business email is not configured");
  }

  const businessEmail = process.env.BUSINESS_EMAIL;
  const businessName = process.env.BUSINESS_NAME || "TravelWithMe - Sri Lanka";

  // Prepare email template data
=======
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

  if (!accessKey) {
    throw new Error("Web3Forms access key is not configured");
  }

  const businessName = process.env.BUSINESS_NAME || "TravelWithMe - Sri Lanka";

  // Prepare email template data for our own record
>>>>>>> eae511145998e77f5a92066f5cd4016cc3781ee7
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

<<<<<<< HEAD
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

=======
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
>>>>>>> eae511145998e77f5a92066f5cd4016cc3781ee7
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
<<<<<<< HEAD
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
=======
 * Validates email configuration
 * @returns True if configured correctly
 */
export function validateEmailConfig(): { valid: boolean; error?: string } {
  if (!process.env.WEB3FORMS_ACCESS_KEY) {
    return {
      valid: false,
      error: "WEB3FORMS_ACCESS_KEY is not set in environment variables",
>>>>>>> eae511145998e77f5a92066f5cd4016cc3781ee7
    };
  }

  return { valid: true };
}
