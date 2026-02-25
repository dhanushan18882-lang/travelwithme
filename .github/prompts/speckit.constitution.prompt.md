---
agent: speckit.constitution
---

# TravelWithMe - Sri Lanka: Project Constitution

## 1. Project Identity

- **Name:** TravelWithMe - Sri Lanka
- **Type:** Dynamic Travel Agency Web Application
- **Architecture:** Full-stack (React frontend + Backend API)
- **Target Users:** International tourists seeking Sri Lankan travel experiences
- **Primary Goal:** Lead generation and customer inquiry management via contact forms

## 2. Technology Stack

### Frontend

- React 19.2.0 with TypeScript 5.8.2
- Vite 6.2.0 (build tool & dev server)
- Tailwind CSS (utility-first styling via CDN)
- Lucide React (icon library)

### Backend (Required for Dynamic Features)

- Node.js + Express.js OR Serverless Functions (Vercel/Netlify)
- Email Service: Nodemailer, SendGrid, or AWS SES
- Environment variables for API keys and credentials
- CORS enabled for frontend-backend communication

### Hosting

- Frontend: Vercel/Netlify
- Backend: Serverless functions OR separate Node.js server
- Database: Optional (for storing inquiries)

## 3. Design System

### Color Palette

- **Primary:** Green (#14532d to #f0fdf4) - nature/jungle theme
- **Accent:** Golden orange (#d97706) - CTAs and highlights
- **Neutrals:** Stone palette (#stone-50 to #stone-900)
- **Usage:** 60-30-10 color distribution rule

### Typography

- **Headings:** Playfair Display (serif) - luxury, elegance
- **Body:** Plus Jakarta Sans (sans-serif) - modern readability
- **Scale:** text-5xl → text-4xl → text-2xl → text-lg → text-sm

### Spacing & Layout

- **Container:** max-w-7xl (1280px)
- **Section Padding:** py-24 (96px vertical), px-4 (horizontal)
- **Grid Systems:** 1→2→3→4 columns (mobile→desktop)
- **Border Radius:** rounded-2xl (16px), rounded-xl (12px), rounded-lg (8px)

### Animation Standards

- **Duration:** 300ms (quick), 500ms (normal), 700ms (slow)
- **Hover Effects:** scale-105, scale-110, opacity transitions
- **Scroll Behavior:** smooth enabled globally
- **Group Patterns:** Use group-hover for nested elements

## 4. Component Architecture

### Structure Rules

- Functional components with TypeScript
- React.FC type annotations
- Props interfaces defined in `/types.ts`
- One component per file in `/components` directory
- Shared utilities in `/utils` or `/lib`

### Navigation Pattern

- Client-side routing via state management (custom)
- Page types: 'home' | 'destinations' | 'contact'
- No external router dependency (React Router not used)
- Smooth scroll to top on page transitions
- NavigationProps interface for consistency

### Responsive Design

- **Approach:** Mobile-first
- **Breakpoints:** sm: 640px, md: 768px, lg: 1024px, xl: 1280px
- **Mobile Menu:** Hamburger menu below md breakpoint
- **Touch Targets:** Minimum 44x44px

## 5. Data Models

### Destination

```typescript
interface Destination {
  id: number;
  name: string;
  image: string;
  description: string;
  category: "Heritage" | "Nature" | "Beaches" | "Wildlife";
}
```

### Feature

```typescript
interface Feature {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}
```

### Contact Form Data

```typescript
interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  destination?: string;
  message: string;
}
```

## 6. Backend API Structure

### Required Endpoints

- **POST /api/contact** - Submit contact form
  - Request: ContactFormData
  - Response: { success: boolean, message: string }
  - Email to business owner
  - Optional: Save to database

### Email Configuration

- Use environment variables for credentials
- Required ENV vars: EMAIL_SERVICE, EMAIL_USER, EMAIL_PASSWORD, BUSINESS_EMAIL
- HTML email templates for professional appearance
- Include all form fields in email body
- Auto-reply to customer (optional)

### Error Handling

- Validation errors: 400 Bad Request
- Server errors: 500 Internal Server Error
- Rate limiting: Prevent spam (max 5 requests/hour per IP)
- CORS configuration for allowed origins

## 7. Image & Media Guidelines

- **Source:** picsum.photos (development), real images (production)
- **Formats:** WebP with JPEG fallback
- **Aspect Ratios:**
  - Hero: 16:9 (1920x1080)
  - Destination cards: 4:5 (800x1000)
  - Gallery: Mixed (800x600, 600x800)
- **Optimization:** Compress to <200KB per image
- **Alt Text:** Required for accessibility

## 8. Code Quality Standards

### TypeScript

- Strict null checks enabled
- Explicit return types for functions
- Export shared types from types.ts
- No implicit any

### React Best Practices

- Use hooks (useState, useEffect, useCallback, useMemo)
- Proper cleanup in useEffect
- Event handler memoization for performance
- Accessibility attributes (aria-label, role)

### Performance

- Lazy loading for images and components
- Code splitting for routes
- Debounce form inputs
- Bundle size target: <500KB initial load

## 9. Security Requirements

### Frontend

- Input validation and sanitization
- XSS prevention (no dangerouslySetInnerHTML without sanitization)
- HTTPS only in production
- CSP headers configured

### Backend

- Rate limiting on API endpoints
- Request body size limits
- Email validation (regex + DNS check)
- SQL injection prevention (if using database)
- API key rotation policy

## 10. Development Constraints

### Must Maintain

- TypeScript strict mode enabled
- No `any` types (use proper interfaces)
- Environment variables for all secrets
- Vite dev server on port 3000
- Component-based architecture

### Avoid

- Heavy external dependencies (keep bundle small)
- Inline styles (use Tailwind classes)
- Prop drilling beyond 2 levels (consider context if needed)
- Blocking API calls (use async/await properly)

## 11. Testing Strategy

### Unit Tests

- Component rendering tests
- Form validation logic
- Utility functions
- Coverage target: >70%

### Integration Tests

- API endpoint responses
- Form submission flow
- Email sending verification
- Navigation flow

### E2E Tests (Optional)

- User booking journey
- Contact form submission
- Mobile responsiveness
- Cross-browser compatibility

## 12. SEO & Marketing

### Meta Tags

- Dynamic titles per page
- OpenGraph tags for social sharing
- Twitter cards
- Canonical URLs

### Schema.org Markup

- TravelAgency schema
- TouristDestination schema
- ContactPoint schema
- Breadcrumbs

### Analytics

- Google Analytics 4 integration
- Conversion tracking (form submissions)
- Event tracking (button clicks, page views)
- Privacy-compliant (GDPR/CCPA)

## 13. Accessibility (WCAG 2.1 AA)

- Semantic HTML5 elements
- Keyboard navigation support
- Screen reader friendly labels
- Color contrast ratio ≥4.5:1
- Focus indicators visible
- Form error announcements

## 14. Version Control & Deployment

### Git Workflow

- Feature branches from main
- Conventional commits: feat:, fix:, docs:, style:, refactor:
- Pull request reviews required
- Protect main branch

### Deployment Pipeline

- **Frontend:** Vercel or Netlify auto-deploy
- **Backend:** Serverless functions or separate deployment
- **Environments:** Development, Staging, Production
- **Environment Variables:** Set in hosting platform dashboard
- **Preview URLs:** Auto-generated for PRs

### Environment Variables

```bash
# Frontend
VITE_API_URL=https://api.travelwithme.lk

# Backend
EMAIL_SERVICE=gmail
EMAIL_USER=noreply@travelwithme.lk
EMAIL_PASSWORD=***
BUSINESS_EMAIL=bookings@travelwithme.lk
ALLOWED_ORIGINS=https://travelwithme.lk
```

## 15. Mobile-First Considerations

### Touch Interactions

- Minimum tap targets: 44x44px
- Swipe gestures for gallery
- Pull-to-refresh disabled (avoid conflicts)

### Performance

- Optimize for 3G networks
- Progressive image loading
- Service worker for static assets (optional)
- Lazy load below-fold content

### UX Patterns

- Sticky navigation on mobile
- Bottom-aligned CTAs
- Toast notifications for feedback
- Loading states for async actions

## 16. Feature Request Template

When proposing new features:

1. **User Story:** "As a [user type], I want [feature] so that [benefit]"
2. **Acceptance Criteria:** List specific, testable requirements
3. **Technical Approach:** Frontend + Backend changes needed
4. **Dependencies:** New packages or services required
5. **Impact Assessment:**
   - Bundle size increase
   - Performance implications
   - Security considerations
6. **Migration Plan:** If modifying existing features
7. **Rollback Strategy:** How to revert if issues arise

## 17. Maintenance & Updates

### Regular Tasks

- Dependency updates (monthly)
- Security patches (as released)
- Performance audits (quarterly)
- Accessibility audits (semi-annually)
- Backup contact form submissions (if stored)

### Monitoring

- Uptime monitoring (UptimeRobot, Pingdom)
- Error tracking (Sentry, LogRocket)
- Email delivery monitoring
- API response times

---

**Constitution Version:** 2.0  
**Last Updated:** November 25, 2025  
**Review Cycle:** Quarterly or when major features added
