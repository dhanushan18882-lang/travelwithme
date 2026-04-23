---
agent: speckit.clarify
---

# Feature Clarification Questions: Contact Form Email Notification

## 📋 Implementation Clarifications Needed

Before implementing the contact form email notification feature, please clarify the following questions to ensure the implementation meets your exact requirements:

---

## 1. Email Service Provider

**Question:** Which email service would you prefer to use?

**Options:**

- **A) Gmail with Nodemailer** (Free, easier setup, requires app password)
  - ✅ Pros: Free, simple configuration, good for development
  - ❌ Cons: Daily sending limits (500 emails/day), requires Gmail account
- **B) SendGrid** (Free tier: 100 emails/day, requires API key)
  - ✅ Pros: Professional, better deliverability, analytics dashboard
  - ❌ Cons: Requires account signup, API key management
- **C) AWS SES** (Pay-as-you-go, $0.10 per 1000 emails)
  - ✅ Pros: Scalable, lowest cost at scale, enterprise-grade
  - ❌ Cons: Requires AWS account, more complex setup

**Recommendation:** Gmail for development/testing, SendGrid for production

**Your Choice:** ****\*\*****\_\_\_****\*\*****

---

## 2. Business Owner Email Address

**Question:** What email address should receive the contact form submissions?

**Current in specification:** `bookings@travelwithme.lk`

**Please confirm or provide:**

- Primary email: ****\*\*****\_\_\_****\*\*****
- CC email (optional): ****\*\*****\_\_\_****\*\*****
- Should we send to multiple recipients? Yes / No

---

## 3. Customer Auto-Reply

**Question:** Do you want customers to receive an automatic confirmation email after submitting the form?

**Options:**

- **A) Yes, send auto-reply** - Professional, builds trust, confirms receipt
- **B) No, only notify owner** - Simpler, fewer emails sent

**If Yes:**

- What email should it come from? (e.g., `noreply@travelwithme.lk`)
- What sender name? (e.g., "TravelWithMe Team")

**Your Choice:** ****\*\*****\_\_\_****\*\*****

---

## 4. Form Success Behavior

**Question:** After successful submission, what should happen?

**Options:**

- **A) Show success message + clear form** (Current spec)
- **B) Show success message + keep form data** (Allow users to review)
- **C) Redirect to thank you page**
- **D) Show success message + download PDF brochure**

**Your Choice:** ****\*\*****\_\_\_****\*\*****

---

## 5. Database Storage

**Question:** Should we store form submissions in a database for backup/analytics?

**Options:**

- **A) Yes, store in database**
  - Which database? (PostgreSQL, MongoDB, Supabase, Firebase)
  - ***
- **B) No, email only** (Simpler, current spec)
- **C) Maybe later** (Start with email, add database in Phase 2)

**Your Choice:** ****\*\*****\_\_\_****\*\*****

---

## 6. Rate Limiting Strictness

**Question:** How strict should the spam prevention be?

**Current spec:** 5 submissions per hour per IP address

**Options:**

- **A) More strict** - 3 submissions per hour (prevents abuse better)
- **B) Current setting** - 5 submissions per hour (balanced)
- **C) Less strict** - 10 submissions per hour (more lenient)
- **D) Custom** - Specify: ****\*\*****\_\_\_****\*\*****

**Your Choice:** ****\*\*****\_\_\_****\*\*****

---

## 7. Form Validation Requirements

**Question:** Should we validate the message content for spam/inappropriate content?

**Options:**

- **A) Basic validation only** - Length checks, required fields (current spec)
- **B) Spam filtering** - Block common spam keywords, suspicious patterns
- **C) Profanity filter** - Block offensive language
- **D) AI content moderation** - Use AI to detect spam (requires API)

**Your Choice:** ****\*\*****\_\_\_****\*\*****

---

## 8. Response Time Expectation

**Question:** What response time should we communicate to customers in the auto-reply email?

**Current spec:** "within 24 hours"

**Options:**

- **A) Within 24 hours** (Current)
- **B) Within 12 hours**
- **C) Within 48 hours**
- **D) Within 1 business day**
- \*\*E) Custom: ****\*\*****\_\_\_****\*\*****

**Your Choice:** ****\*\*****\_\_\_****\*\*****

---

## 9. Mobile Phone Number Field

**Question:** Should we add a phone number field to the contact form?

**Current form fields:**

- First Name ✅
- Last Name ✅
- Email ✅
- Destination (optional) ✅
- Message ✅

**Should we add:**

- **Phone Number** - Yes / No
  - If yes: Required or Optional?
  - If yes: International format validation?

**Your Choice:** ****\*\*****\_\_\_****\*\*****

---

## 10. Business Hours Notification

**Question:** Should we inform users about business hours or expected response delays?

**Options:**

- **A) No special handling** - Same message always
- **B) Show business hours** - Display office hours on contact page
- **C) After-hours message** - Different message if submitted outside business hours
- **D) Weekend notification** - Inform if submitted on weekend

**Your Business Hours (if applicable):**

- Days: ****\*\*****\_\_\_****\*\*****
- Time: ****\*\*****\_\_\_****\*\*****
- Timezone: ****\*\*****\_\_\_****\*\*****

**Your Choice:** ****\*\*****\_\_\_****\*\*****

---

## 11. Email Template Customization

**Question:** Do you want to customize the email templates before implementation?

**Current design:** Professional green/gold theme matching website

**Customization needed:**

- **A) Use as-is** - Standard templates provided
- **B) Add company logo** - Provide logo URL
- **C) Change colors** - Specify hex codes
- **D) Custom branding** - Provide specific design requirements

**If customization needed, please provide:**

- Logo URL: ****\*\*****\_\_\_****\*\*****
- Preferred colors: ****\*\*****\_\_\_****\*\*****
- Additional branding notes: ****\*\*****\_\_\_****\*\*****

**Your Choice:** ****\*\*****\_\_\_****\*\*****

---

## 12. Notification Priority

**Question:** How urgent should these email notifications be treated?

**Options:**

- **A) Normal priority** - Standard email delivery
- **B) High priority** - Mark emails as high importance
- **C) SMS backup** - Send SMS if email fails (requires Twilio/similar)
- **D) Slack/Discord notification** - Also send to messaging platform

**Your Choice:** ****\*\*****\_\_\_****\*\*****

---

## 13. Data Retention & Privacy

**Question:** What's your data retention policy for customer inquiries?

**Considerations:**

- How long to keep email records?
- GDPR compliance needed? (EU customers)
- Privacy policy link on form?

**Please specify:**

- Data retention period: ****\*\*****\_\_\_****\*\*****
- GDPR compliance needed: Yes / No
- Add privacy policy checkbox: Yes / No
- Privacy policy URL (if applicable): ****\*\*****\_\_\_****\*\*****

**Your Choice:** ****\*\*****\_\_\_****\*\*****

---

## 14. Testing & Staging

**Question:** Do you want a staging environment for testing before production?

**Options:**

- **A) Direct to production** - Faster, test carefully
- **B) Staging environment first** - Safer, more setup
- **C) Test mode toggle** - Feature flag to enable/disable

**Your Choice:** ****\*\*****\_\_\_****\*\*****

---

## 15. Error Handling & User Feedback

**Question:** How should we display errors to users?

**Current spec:** Inline error messages below fields

**Options:**

- **A) Inline errors** - Below each field (current)
- **B) Toast notifications** - Pop-up messages
- **C) Modal dialog** - Alert-style messages
- **D) Top banner** - Error summary at top of form

**Your Choice:** ****\*\*****\_\_\_****\*\*****

---

## 16. Analytics & Tracking

**Question:** Should we track form submission analytics?

**Metrics to track:**

- Form views vs submissions (conversion rate)
- Field completion rates
- Error frequency by field
- Abandonment points

**Options:**

- **A) Yes, track everything** - Full analytics
- **B) Basic tracking only** - Submit count, success/fail
- **C) No tracking** - Privacy-focused
- **D) Google Analytics integration** - Use existing GA

**Your Choice:** ****\*\*****\_\_\_****\*\*****

---

## 17. Destination Field Enhancement

**Question:** Should the destination dropdown be dynamic (from database) or static (hardcoded)?

**Current spec:** Static dropdown with 6 options

**Options:**

- **A) Keep static** - Hardcoded list in component
- **B) Make dynamic** - Fetch from API/database
- **C) Add "Other" option** - With text input for custom destination

**Your Choice:** ****\*\*****\_\_\_****\*\*****

---

## 18. Follow-up Automation

**Question:** Do you want automated follow-up emails if no response received?

**Example:** Send reminder email to customer after 48 hours if owner hasn't responded

**Options:**

- **A) No automation** - Manual follow-up only
- **B) Reminder to owner** - Email owner if no response in X hours
- **C) Customer follow-up** - Check-in email to customer after X days
- **D) Full automation** - Both owner reminders and customer follow-ups

**Your Choice:** ****\*\*****\_\_\_****\*\*****

---

## 19. Attachment Support

**Question:** Should customers be able to upload attachments? (e.g., travel documents, inspiration photos)

**Options:**

- **A) No attachments** - Text-only (current spec)
- **B) Yes, images only** - JPG, PNG (max 5MB)
- **C) Yes, documents** - PDF, images (max 10MB)
- **D) Cloud storage links** - Allow Dropbox/Google Drive links

**Your Choice:** ****\*\*****\_\_\_****\*\*****

---

## 20. Deployment Timeline

**Question:** When do you need this feature live?

**Options:**

- **A) ASAP** - Prioritize speed
- **B) Within 1 week** - Balanced approach
- **C) Within 2 weeks** - More thorough testing
- **D) No rush** - Take time for perfect implementation

**Preferred deadline:** ****\*\*****\_\_\_****\*\*****

**Launch preference:**

- Deploy to production immediately: Yes / No
- Soft launch (test with limited users): Yes / No
- Phased rollout: Yes / No

---

## 📝 Additional Notes

**Any other requirements, preferences, or concerns not covered above?**

---

---

---

---

## ✅ Next Steps After Clarification

Once you've answered these questions:

1. **Review answers** - I'll review and confirm understanding
2. **Update specification** - Revise the technical spec based on answers
3. **Get approval** - Confirm final spec before coding
4. **Begin implementation** - Start development with clear requirements
5. **Testing** - Test according to your preferences
6. **Deployment** - Launch based on your timeline

---

**Clarification Document Version:** 1.0  
**Created:** November 25, 2025  
**Status:** Awaiting Responses  
**Estimated Review Time:** 15-20 minutes to complete
