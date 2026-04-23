// Email template for owner notification
// High priority, professional HTML formatting

export interface EmailTemplateData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  destination?: string;
  customDestination?: string;
  message: string;
  timestamp: string;
  submissionId: string;
}

/**
 * Generates HTML email template for business owner
 * @param data - Form submission data
 * @returns HTML email string
 */
export function generateOwnerEmailTemplate(data: EmailTemplateData): string {
  const fullName = `${data.firstName} ${data.lastName}`;
  const destinationDisplay =
    data.destination === "Other" && data.customDestination
      ? `Other - ${data.customDestination}`
      : data.destination || "Not specified";

  const phoneDisplay = data.phone || "Not provided";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Travel Inquiry - TravelWithMe</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Arial', 'Helvetica', sans-serif;
      background-color: #f5f5f4;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #14532d 0%, #166534 100%);
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 24px;
      font-weight: bold;
    }
    .header p {
      color: #dcfce7;
      margin: 10px 0 0;
      font-size: 14px;
    }
    .priority-badge {
      display: inline-block;
      background-color: #d97706;
      color: #ffffff;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      margin-top: 10px;
    }
    .content {
      padding: 30px 20px;
      background-color: #fafaf9;
    }
    .section-title {
      color: #14532d;
      font-size: 20px;
      font-weight: bold;
      margin: 0 0 20px 0;
      border-bottom: 2px solid #d97706;
      padding-bottom: 10px;
    }
    .info-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
    }
    .info-table tr {
      border-bottom: 1px solid #e7e5e4;
    }
    .info-table tr:last-child {
      border-bottom: none;
    }
    .info-table td {
      padding: 15px;
      font-size: 14px;
    }
    .info-table td:first-child {
      font-weight: bold;
      color: #57534e;
      width: 140px;
    }
    .info-table td:last-child {
      color: #1c1917;
    }
    .email-link {
      color: #d97706;
      text-decoration: none;
    }
    .email-link:hover {
      text-decoration: underline;
    }
    .message-box {
      background-color: #ffffff;
      border-left: 4px solid #d97706;
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
      white-space: pre-wrap;
      word-wrap: break-word;
      line-height: 1.6;
      color: #1c1917;
      font-size: 14px;
    }
    .action-buttons {
      text-align: center;
      margin: 30px 0;
    }
    .action-button {
      display: inline-block;
      background-color: #14532d;
      color: #ffffff;
      padding: 14px 30px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: bold;
      font-size: 14px;
      margin: 0 10px;
      transition: background-color 0.3s;
    }
    .action-button:hover {
      background-color: #166534;
    }
    .footer {
      background-color: #f5f5f4;
      padding: 20px;
      text-align: center;
      color: #78716c;
      font-size: 12px;
    }
    .footer p {
      margin: 5px 0;
    }
    .submission-id {
      font-family: monospace;
      background-color: #e7e5e4;
      padding: 2px 6px;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>🌴 New Travel Inquiry</h1>
      <p>TravelWithMe - Sri Lanka</p>
      <div class="priority-badge">⚡ HIGH PRIORITY</div>
    </div>
    
    <!-- Content -->
    <div class="content">
      <h2 class="section-title">Customer Information</h2>
      
      <table class="info-table">
        <tr>
          <td>Name:</td>
          <td><strong>${fullName}</strong></td>
        </tr>
        <tr>
          <td>Email:</td>
          <td><a href="mailto:${data.email}" class="email-link">${
    data.email
  }</a></td>
        </tr>
        <tr>
          <td>Phone:</td>
          <td>${phoneDisplay}</td>
        </tr>
        <tr>
          <td>Interested Destination:</td>
          <td><strong>${destinationDisplay}</strong></td>
        </tr>
        <tr>
          <td>Submission Time:</td>
          <td>${data.timestamp}</td>
        </tr>
        <tr>
          <td>Submission ID:</td>
          <td><span class="submission-id">${data.submissionId}</span></td>
        </tr>
      </table>
      
      <h2 class="section-title">Customer Message</h2>
      
      <div class="message-box">${data.message}</div>
      
      <!-- Action Buttons -->
      <div class="action-buttons">
        <a href="mailto:${
          data.email
        }" class="action-button">📧 Reply to Customer</a>
      </div>
      
      <!-- Tips -->
      <table class="info-table">
        <tr>
          <td colspan="2" style="background-color: #dcfce7; padding: 15px;">
            <strong style="color: #14532d;">💡 Quick Response Tips:</strong><br>
            <span style="color: #166534; font-size: 13px;">
              • Respond within 24 hours for best results<br>
              • Personalize your response based on their destination interest<br>
              • Include pricing and availability information<br>
              • Suggest additional destinations they might enjoy
            </span>
          </td>
        </tr>
      </table>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <p><strong>TravelWithMe - Sri Lanka</strong></p>
      <p>No. 123, Galle Road, Colombo 03, Sri Lanka</p>
      <p>📞 +94 11 234 5678 | 📧 ${
        process.env.BUSINESS_EMAIL || "bookings@travelwithme.lk"
      }</p>
      <p style="margin-top: 15px; font-size: 11px; color: #a8a29e;">
        This email was automatically generated from a contact form submission on your website.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Generates plain text version of owner email (fallback)
 * @param data - Form submission data
 * @returns Plain text email string
 */
export function generateOwnerEmailText(data: EmailTemplateData): string {
  const fullName = `${data.firstName} ${data.lastName}`;
  const destinationDisplay =
    data.destination === "Other" && data.customDestination
      ? `Other - ${data.customDestination}`
      : data.destination || "Not specified";
  const phoneDisplay = data.phone || "Not provided";

  return `
NEW TRAVEL INQUIRY - HIGH PRIORITY
TravelWithMe - Sri Lanka

CUSTOMER INFORMATION
====================
Name: ${fullName}
Email: ${data.email}
Phone: ${phoneDisplay}
Interested Destination: ${destinationDisplay}
Submission Time: ${data.timestamp}
Submission ID: ${data.submissionId}

CUSTOMER MESSAGE
================
${data.message}

QUICK ACTIONS
=============
Reply to customer: ${data.email}

---
TravelWithMe - Sri Lanka
No. 123, Galle Road, Colombo 03, Sri Lanka
+94 11 234 5678 | ${process.env.BUSINESS_EMAIL || "bookings@travelwithme.lk"}
  `.trim();
}
