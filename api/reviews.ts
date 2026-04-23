import type { VercelRequest, VercelResponse } from "@vercel/node";
import { detectSpam, sanitizeInput } from "../lib/validation.js";
import {
  checkRateLimit,
  formatRemainingTime,
  getClientIP,
  getRateLimitReset,
} from "../lib/rateLimit.js";

interface ReviewRecord {
  id: string;
  name: string;
  destination: string;
  rating: number;
  comment: string;
  createdAt: string;
  quickTags?: string[];
}

interface CreateReviewInput {
  name: string;
  destination: string;
  rating: number;
  comment: string;
  quickTags?: string[];
}

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  data?: CreateReviewInput;
}

interface SupabaseReviewRow {
  id: string;
  name: string;
  destination: string;
  rating: number;
  comment: string;
  quick_tags: string[] | null;
  created_at: string;
}

const fallbackSeedReviews: ReviewRecord[] = [
  {
    id: "seed-1",
    name: "Amara Perera",
    destination: "Ella",
    rating: 5,
    comment:
      "Everything was perfectly organized. The train ride and hotel view in Ella were unforgettable.",
    createdAt: "2026-02-18T08:30:00.000Z",
    quickTags: ["Great Guide", "Would Recommend"],
  },
  {
    id: "seed-2",
    name: "David Miller",
    destination: "Sigiriya",
    rating: 4,
    comment:
      "Great local guide and smooth transport. Would definitely book again for another region.",
    createdAt: "2026-01-22T11:00:00.000Z",
    quickTags: ["Smooth Travel", "Value for Money"],
  },
  {
    id: "seed-3",
    name: "Nethmi Jayasinghe",
    destination: "Mirissa",
    rating: 5,
    comment:
      "Our whale watching tour was amazing. Communication was fast and helpful throughout.",
    createdAt: "2025-12-04T06:20:00.000Z",
    quickTags: ["Would Recommend"],
  },
];

function setCorsHeaders(res: VercelResponse) {
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
    "http://localhost:5173",
  ];

  res.setHeader("Access-Control-Allow-Origin", allowedOrigins[0]);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function getSupabaseBaseUrl(): string {
  return (process.env.SUPABASE_URL || "").replace(/\/$/, "");
}

function mapSupabaseRowToReview(row: SupabaseReviewRow): ReviewRecord {
  return {
    id: row.id,
    name: row.name,
    destination: row.destination,
    rating: row.rating,
    comment: row.comment,
    createdAt: row.created_at,
    quickTags: row.quick_tags || [],
  };
}

async function getSupabaseReviews(): Promise<ReviewRecord[]> {
  const baseUrl = getSupabaseBaseUrl();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  const response = await fetch(
    `${baseUrl}/rest/v1/reviews?select=id,name,destination,rating,comment,quick_tags,created_at&order=created_at.desc&limit=50`,
    {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    }
  );

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Supabase GET failed: ${response.status} ${details}`);
  }

  const rows = (await response.json()) as SupabaseReviewRow[];
  return rows.map(mapSupabaseRowToReview);
}

async function createSupabaseReview(input: CreateReviewInput): Promise<ReviewRecord> {
  const baseUrl = getSupabaseBaseUrl();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  const response = await fetch(`${baseUrl}/rest/v1/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      name: input.name,
      destination: input.destination,
      rating: input.rating,
      comment: input.comment,
      quick_tags: input.quickTags || [],
      created_at: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Supabase POST failed: ${response.status} ${details}`);
  }

  const rows = (await response.json()) as SupabaseReviewRow[];
  if (!rows[0]) {
    throw new Error("Supabase did not return the inserted review.");
  }

  return mapSupabaseRowToReview(rows[0]);
}

function getFallbackStore(): ReviewRecord[] {
  const g = globalThis as typeof globalThis & {
    __travelWithMeReviews?: ReviewRecord[];
  };

  if (!g.__travelWithMeReviews) {
    g.__travelWithMeReviews = [...fallbackSeedReviews];
  }

  return g.__travelWithMeReviews;
}

function getFallbackReviews(): ReviewRecord[] {
  return [...getFallbackStore()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

function createFallbackReview(input: CreateReviewInput): ReviewRecord {
  const review: ReviewRecord = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: input.name,
    destination: input.destination,
    rating: input.rating,
    comment: input.comment,
    createdAt: new Date().toISOString(),
    quickTags: input.quickTags || [],
  };

  const store = getFallbackStore();
  store.unshift(review);
  return review;
}

function parseBody(body: unknown): Record<string, unknown> {
  if (!body) {
    return {};
  }

  if (typeof body === "string") {
    try {
      return JSON.parse(body) as Record<string, unknown>;
    } catch {
      return {};
    }
  }

  if (typeof body === "object") {
    return body as Record<string, unknown>;
  }

  return {};
}

function validateReviewInput(input: Record<string, unknown>): ValidationResult {
  const errors: Record<string, string> = {};

  const name = sanitizeInput(String(input.name || ""));
  const destination = sanitizeInput(String(input.destination || ""));
  const rating = Number(input.rating);
  const comment = sanitizeInput(String(input.comment || ""));

  const quickTags = Array.isArray(input.quickTags)
    ? input.quickTags
        .map((tag) => sanitizeInput(String(tag)))
        .filter((tag) => tag.length > 0)
        .slice(0, 5)
    : [];

  if (name.length < 2 || name.length > 60) {
    errors.name = "Name must be between 2 and 60 characters.";
  }

  if (destination.length < 2 || destination.length > 80) {
    errors.destination = "Destination must be between 2 and 80 characters.";
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    errors.rating = "Rating must be an integer from 1 to 5.";
  }

  if (comment.length < 20 || comment.length > 500) {
    errors.comment = "Review must be between 20 and 500 characters.";
  }

  if (detectSpam(comment)) {
    errors.comment = "Your review appears to include spam-like content.";
  }

  const hasTagLengthError = quickTags.some((tag) => tag.length > 40);
  if (hasTagLengthError) {
    errors.quickTags = "Each quick tag must be under 40 characters.";
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    errors,
    data: {
      name,
      destination,
      rating,
      comment,
      quickTags,
    },
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    if (req.method === "GET") {
      const source = isSupabaseConfigured() ? "supabase" : "memory";
      const reviews = isSupabaseConfigured()
        ? await getSupabaseReviews()
        : getFallbackReviews();

      return res.status(200).json({
        success: true,
        source,
        reviews,
      });
    }

    if (req.method === "POST") {
      const clientIP = getClientIP(
        req.headers as Record<string, string | string[] | undefined>
      );

      if (!checkRateLimit(clientIP)) {
        const resetIn = getRateLimitReset(clientIP);
        return res.status(429).json({
          success: false,
          message: `Too many review submissions. Try again in ${formatRemainingTime(
            resetIn
          )}.`,
        });
      }

      const payload = parseBody(req.body);
      const validation = validateReviewInput(payload);

      if (!validation.isValid || !validation.data) {
        return res.status(400).json({
          success: false,
          message: "Please fix the highlighted review fields.",
          errors: validation.errors,
        });
      }

      const source = isSupabaseConfigured() ? "supabase" : "memory";
      const review = isSupabaseConfigured()
        ? await createSupabaseReview(validation.data)
        : createFallbackReview(validation.data);

      return res.status(201).json({
        success: true,
        source,
        review,
      });
    }

    return res.status(405).json({
      success: false,
      message: "Method not allowed. Use GET or POST.",
    });
  } catch (error: any) {
    console.error("❌ Reviews API error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to process reviews right now. Please try again.",
    });
  }
}
