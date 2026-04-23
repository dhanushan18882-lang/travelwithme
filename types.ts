import React from 'react';

export interface Destination {
  id: number;
  name: string;
  image: string;
  description: string;
  category?: string;
}

export interface Feature {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export type Page = 'home' | 'destinations' | 'contact';

export interface NavigationProps {
  onNavigate: (page: Page) => void;
}

// Contact Form Types
export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  destination?: string;
  customDestination?: string;
  message: string;
  privacyConsent: boolean;
}

export interface ContactFormResponse {
  success: boolean;
  message: string;
  submissionId?: string;
}

export interface Review {
  id: string;
  name: string;
  destination: string;
  rating: number;
  comment: string;
  createdAt: string;
}