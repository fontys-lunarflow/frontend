/**
 * API configuration for backend services
 */

// Base URL for API requests
export const API_BASE_URL = 'http://content_api:8080';

/**
 * Content item interface for API responses and requests
 */
export interface ContentItem {
  id?: number;
  title: string;
  subject: string;
  topic: string;
  projectId: number;
  // Additional optional fields
  date?: string;
  bookmarked?: boolean;
  tags?: string[];
  description?: string;
  location?: string;
  owners?: string[];
  topics?: string[];
  department?: string;
  project?: string;
  gitlabLink?: string;
  startTime?: string;
  endTime?: string;
  timezone?: string;
  participants?: string[];
} 