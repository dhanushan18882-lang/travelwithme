---
agent: speckit.specify
---

# Feature Specification: Contact Form Email Notification System

## 1. Feature Overview

**Feature Name:** Contact Form to Email Notification  
**Feature ID:** FEATURE-001  
**Priority:** High  
**Type:** Backend Integration + Frontend Enhancement  
**Estimated Effort:** Medium (8-12 hours)

### User Story

> "As a business owner, I want to receive structured email notifications when customers submit the contact form, so that I can promptly respond to travel inquiries and capture leads effectively."

### Business Value

- **Lead Capture:** Immediate notification of potential customer inquiries
- **Response Time:** Enable quick follow-up to travel requests
- **Data Collection:** Structured customer information for CRM
- **Professional Image:** Automated acknowledgment to customers

---

## 2. Acceptance Criteria

### Must Have

- ✅ Contact form validates all required fields before submission
- ✅ Form data is sent to backend API endpoint via POST request
- ✅ Business owner receives formatted HTML email with all form details
- ✅ Customer receives auto-reply confirmation email
- ✅ Form shows success message after successful submission
- ✅ Form shows error message if submission fails
- ✅ Loading state displayed during form submission
- ✅ Form clears all fields after successful submission

### Should Have

- ⚡ Rate limiting to prevent spam (max 5 submissions per hour per IP)
- ⚡ Email includes timestamp and submission ID
- ⚡ Backend logs all submissions for tracking
- ⚡ Retry mechanism if email fails to send

### Could Have

- 💡 Save submissions to database for backup
- 💡 Admin dashboard to view all submissions
- 💡 Email notification when form submission fails

### Won't Have (This Release)

- ❌ File upload capability
- ❌ Multi-step form wizard
- ❌ Real-time chat integration

---

## 3. Technical Specification

### 3.1 Frontend Changes

#### File: `components/ContactPage.tsx`

**Current State:** Static form with no submission logic

**Required Changes:**

1. Add form state management using `useState`
2. Add form validation logic
3. Add submission handler with async API call
4. Add loading state during submission
5. Add success/error toast notifications
6. Clear form after successful submission

**New Imports Required:**

```typescript
import { useState } from "react";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
```

**Form State Interface:**

```typescript
interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  destination: string;
  message: string;
}

interface FormStatus {
  loading: boolean;
  success: boolean;
  error: string | null;
}
```

**Validation Rules:**

- First Name: Required, min 2 characters, max 50 characters
- Last Name: Required, min 2 characters, max 50 characters
- Email: Required, valid email format (regex)
- Destination: Optional
- Message: Required, min 10 characters, max 1000 characters

**API Call:**

```typescript
const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(formData),
});
```

#### File: `types.ts`

**Add New Interfaces:**

```typescript
export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  destination?: string;
  message: string;
}

export interface ContactFormResponse {
  success: boolean;
  message: string;
  submissionId?: string;
}
```

---

### 3.2 Backend Implementation

#### Tech Stack Choice

**Option 1: Vercel Serverless Functions (Recommended)**

- Pro: Zero configuration, auto-scales, free tier generous
- Con: Cold start delays

**Option 2: Netlify Functions**

- Pro: Similar to Vercel, good DX
- Con: Slightly slower cold starts

**Option 3: Express.js Server**

- Pro: Full control, no cold starts
- Con: Requires separate hosting, more complex deployment

**Selected:** Vercel Serverless Functions

---

#### File Structure

```
/api
  /contact.ts        # Serverless function endpoint
/lib
  /email.ts          # Email sending utility
  /validation.ts     # Input validation
  /templates
    /owner-email.html      # Email template for owner
    /customer-reply.html   # Auto-reply template
```

---

#### File: `api/contact.ts`

**Endpoint:** POST /api/contact

**Request Body:**

```typescript
{
  firstName: string;
  lastName: string;
  email: string;
  destination?: string;
  message: string;
}
```

**Response:**

```typescript
// Success (200)
{
  success: true,
  message: "Thank you! We'll contact you soon.",
  submissionId: "sub_1234567890"
}

// Validation Error (400)
{
  success: false,
  message: "Please provide a valid email address."
}

// Rate Limit (429)
{
  success: false,
  message: "Too many requests. Please try again later."
}

// Server Error (500)
{
  success: false,
  message: "Something went wrong. Please try again."
}
```

**Implementation Steps:**

1. Parse and validate request body
2. Check rate limiting (IP-based)
3. Generate unique submission ID
4. Send email to business owner
5. Send auto-reply to customer
6. Return success response
7. Log submission (optional database save)

---

#### File: `lib/email.ts`

**Email Service Options:**

**Option 1: Nodemailer with Gmail (Free)**

```typescript
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD, // Gmail App Password
  },
});
```

**Option 2: SendGrid (Recommended for Production)**

```typescript
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
```

**Option 3: AWS SES (Enterprise)**

- Lower cost at scale
- Requires AWS account setup

**Selected:** Nodemailer with Gmail (development), SendGrid (production)

---

**Email Functions:**

```typescript
export async function sendOwnerNotification(
  data: ContactFormData
): Promise<void>;
export async function sendCustomerAutoReply(
  email: string,
  name: string
): Promise<void>;
```

---

#### Owner Email Template (`lib/templates/owner-email.html`)

**Structure:**

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      /* Professional email styling */
    </style>
  </head>
  <body>
    <div
      style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;"
    >
      <!-- Header with logo/branding -->
      <div style="background: #14532d; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">TravelWithMe - New Inquiry</h1>
      </div>

      <!-- Customer Details Section -->
      <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd;">
        <h2 style="color: #14532d;">Customer Information</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; font-weight: bold; width: 150px;">
              Name:
            </td>
            <td style="padding: 10px;">{{firstName}} {{lastName}}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold;">Email:</td>
            <td style="padding: 10px;">
              <a href="mailto:{{email}}">{{email}}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold;">
              Interested Destination:
            </td>
            <td style="padding: 10px;">{{destination}}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold;">Submission Time:</td>
            <td style="padding: 10px;">{{timestamp}}</td>
          </tr>
        </table>

        <h2 style="color: #14532d; margin-top: 30px;">Message</h2>
        <div
          style="background: white; padding: 20px; border-left: 4px solid #d97706; white-space: pre-wrap;"
        >
          {{message}}
        </div>

        <!-- Quick Action Buttons -->
        <div style="margin-top: 30px; text-align: center;">
          <a
            href="mailto:{{email}}"
            style="display: inline-block; background: #14532d; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 0 10px;"
            >Reply to Customer</a
          >
        </div>
      </div>

      <!-- Footer -->
      <div
        style="padding: 20px; text-align: center; color: #666; font-size: 12px;"
      >
        <p>Submission ID: {{submissionId}}</p>
        <p>© 2025 TravelWithMe - Sri Lanka</p>
      </div>
    </div>
  </body>
</html>
```

---

#### Customer Auto-Reply Template (`lib/templates/customer-reply.html`)

**Structure:**

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      /* Professional email styling */
    </style>
  </head>
  <body>
    <div
      style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;"
    >
      <!-- Header -->
      <div style="background: #14532d; padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">Thank You for Your Inquiry!</h1>
      </div>

      <!-- Message Body -->
      <div style="padding: 40px; background: #f9f9f9; border: 1px solid #ddd;">
        <p style="font-size: 16px; line-height: 1.6; color: #333;">
          Dear {{firstName}},
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #333;">
          Thank you for your interest in exploring Sri Lanka with TravelWithMe!
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #333;">
          We've received your inquiry and our travel specialists will review
          your request. You can expect a personalized response within
          <strong>24 hours</strong>.
        </p>

        <div
          style="background: white; border-left: 4px solid #d97706; padding: 20px; margin: 30px 0;"
        >
          <h3 style="margin-top: 0; color: #14532d;">What Happens Next?</h3>
          <ol style="color: #555; line-height: 1.8;">
            <li>Our team reviews your travel preferences</li>
            <li>We craft a personalized itinerary just for you</li>
            <li>You receive a detailed proposal with pricing</li>
            <li>We refine the plan based on your feedback</li>
          </ol>
        </div>

        <p style="font-size: 16px; line-height: 1.6; color: #333;">
          In the meantime, feel free to explore our
          <a href="https://travelwithme.lk/destinations" style="color: #d97706;"
            >destinations page</a
          >
          for inspiration!
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #333;">
          Have urgent questions? Call us at <strong>+94 11 234 5678</strong>
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #333;">
          Warm regards,<br />
          <strong>The TravelWithMe Team</strong>
        </p>
      </div>

      <!-- Footer -->
      <div
        style="padding: 20px; text-align: center; color: #666; font-size: 12px; background: #14532d; color: white;"
      >
        <p style="margin: 5px 0;">
          📧 bookings@travelwithme.lk | 📞 +94 11 234 5678
        </p>
        <p style="margin: 5px 0;">No. 123, Galle Road, Colombo 03, Sri Lanka</p>
        <p style="margin: 15px 0 5px;">
          <a href="#" style="color: white; margin: 0 10px;">Instagram</a> |
          <a href="#" style="color: white; margin: 0 10px;">Facebook</a> |
          <a href="#" style="color: white; margin: 0 10px;">YouTube</a>
        </p>
      </div>
    </div>
  </body>
</html>
```

---

#### File: `lib/validation.ts`

```typescript
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateContactForm(data: any): ValidationResult {
  const errors: Record<string, string> = {};

  // First Name
  if (!data.firstName || data.firstName.trim().length < 2) {
    errors.firstName = "First name must be at least 2 characters";
  }
  if (data.firstName && data.firstName.length > 50) {
    errors.firstName = "First name must be less than 50 characters";
  }

  // Last Name
  if (!data.lastName || data.lastName.trim().length < 2) {
    errors.lastName = "Last name must be at least 2 characters";
  }
  if (data.lastName && data.lastName.length > 50) {
    errors.lastName = "Last name must be less than 50 characters";
  }

  // Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.email = "Please provide a valid email address";
  }

  // Message
  if (!data.message || data.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters";
  }
  if (data.message && data.message.length > 1000) {
    errors.message = "Message must be less than 1000 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
```

---

### 3.3 Environment Variables

**Frontend (.env.local):**

```bash
VITE_API_URL=http://localhost:3000  # Development
# VITE_API_URL=https://travelwithme.lk  # Production
```

**Backend (.env):**

```bash
# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=noreply@travelwithme.lk
EMAIL_APP_PASSWORD=your_gmail_app_password

# Business Email
BUSINESS_EMAIL=bookings@travelwithme.lk
BUSINESS_NAME=TravelWithMe - Sri Lanka

# SendGrid (Production Alternative)
# SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx

# Security
ALLOWED_ORIGINS=https://travelwithme.lk,http://localhost:3000
RATE_LIMIT_MAX=5
RATE_LIMIT_WINDOW=3600000  # 1 hour in ms
```

---

### 3.4 Rate Limiting Implementation

**Strategy:** In-memory IP tracking (simple implementation)

```typescript
// lib/rateLimit.ts
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    // New window
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + parseInt(process.env.RATE_LIMIT_WINDOW || "3600000"),
    });
    return true;
  }

  if (entry.count >= parseInt(process.env.RATE_LIMIT_MAX || "5")) {
    return false; // Rate limit exceeded
  }

  entry.count++;
  return true;
}
```

**Note:** For production with multiple serverless instances, use Redis or database-based rate limiting.

---

## 4. Dependencies

### Frontend

```json
{
  "dependencies": {
    // Existing dependencies remain
  }
}
```

No new frontend dependencies required.

### Backend

```json
{
  "dependencies": {
    "nodemailer": "^6.9.8",
    "@types/nodemailer": "^6.4.14"
  }
}
```

**Optional (Production):**

```json
{
  "dependencies": {
    "@sendgrid/mail": "^8.1.0"
  }
}
```

---

## 5. Implementation Plan

### Phase 1: Backend Setup (4 hours)

1. ✅ Create `/api/contact.ts` serverless function
2. ✅ Implement validation logic in `/lib/validation.ts`
3. ✅ Create email templates (owner + customer)
4. ✅ Set up Nodemailer with Gmail
5. ✅ Implement rate limiting
6. ✅ Test email sending locally

### Phase 2: Frontend Integration (3 hours)

1. ✅ Update `ContactPage.tsx` with state management
2. ✅ Add form validation
3. ✅ Implement submission handler
4. ✅ Add loading/success/error states
5. ✅ Add toast notifications or inline messages
6. ✅ Test form submission flow

### Phase 3: Testing & QA (2 hours)

1. ✅ Test all validation rules
2. ✅ Test successful submission
3. ✅ Test error scenarios (network failure, invalid data)
4. ✅ Test rate limiting
5. ✅ Verify email delivery and formatting
6. ✅ Test on mobile devices

### Phase 4: Deployment (1 hour)

1. ✅ Set environment variables in Vercel dashboard
2. ✅ Deploy to production
3. ✅ Verify production emails work
4. ✅ Monitor for errors

---

## 6. Testing Scenarios

### Happy Path

1. User fills all required fields correctly
2. Clicks submit button
3. Loading spinner appears
4. Success message displayed
5. Form fields clear
6. Owner receives email with all details
7. Customer receives auto-reply

### Error Scenarios

1. **Validation Error:** Missing required field → Show inline error
2. **Invalid Email:** Wrong email format → Show error message
3. **Network Error:** API unreachable → Show retry message
4. **Rate Limited:** Too many submissions → Show "try again later"
5. **Server Error:** Email fails to send → Log error, show generic message

### Edge Cases

1. Very long message (1000+ chars) → Truncate or reject
2. Special characters in name → Sanitize input
3. Spam-like content → Consider future spam detection
4. Concurrent submissions → Rate limit should handle

---

## 7. Success Metrics

### Key Performance Indicators

- **Form Submission Success Rate:** Target >95%
- **Email Delivery Rate:** Target 100%
- **Average Response Time:** <24 hours to customer
- **Form Abandonment Rate:** <30%

### Monitoring

- Track form submission attempts vs successes
- Log email sending failures
- Monitor API response times
- Track spam/invalid submissions

---

## 8. Security Considerations

### Input Sanitization

- Strip HTML tags from input fields
- Prevent XSS attacks in email templates
- Validate email format server-side

### Rate Limiting

- Prevent spam submissions
- Protect against DDoS
- IP-based throttling

### Data Privacy

- Don't log sensitive data
- Comply with GDPR (if applicable)
- Secure API keys in environment variables
- Use HTTPS in production

### Email Security

- Use app-specific passwords for Gmail
- Don't expose email credentials
- Validate "from" addresses to prevent spoofing

---

## 9. Future Enhancements

### Phase 2 (Future)

- 💡 Save submissions to database (PostgreSQL/MongoDB)
- 💡 Admin dashboard to view all inquiries
- 💡 Email notification preferences
- 💡 Webhook integration with CRM
- 💡 SMS notifications for urgent inquiries
- 💡 Multi-language email templates
- 💡 Spam detection using AI
- 💡 Attachment support (travel documents)

---

## 10. Rollback Plan

### If Issues Occur

1. **Frontend Issue:** Revert `ContactPage.tsx` changes, show static form
2. **Backend Issue:** Disable API endpoint, add "Contact via phone" message
3. **Email Issue:** Implement fallback to different email service
4. **Database Issue:** Skip database logging, email still works

### Monitoring Alerts

- Set up alerts for email sending failures
- Monitor API error rates
- Track form submission success rates

---

**Specification Version:** 1.0  
**Created:** November 25, 2025  
**Status:** Ready for Implementation  
**Estimated Timeline:** 1-2 days  
**Dependencies:** Gmail account or SendGrid API key
