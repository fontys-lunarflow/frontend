/**
 * API configuration for backend services
 */

// Base URL for API requests - defaults to Docker container name, but can be overridden by environment variable
export const API_BASE_URL = process.env.API_BASE_URL || 'http://content-service:8080';
export const TICKET_API_BASE_URL = process.env.TICKET_API_BASE_URL || 'http://ticket-api:8080';
export const USER_API_BASE_URL = process.env.USER_API_BASE_URL || 'http://user-api:8080';

// Client-side API URLs (for browser requests) - these should use your actual domain URLs
export const CLIENT_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://content-api.luxdomain.work';
export const CLIENT_TICKET_API_BASE_URL = process.env.NEXT_PUBLIC_TICKET_API_BASE_URL || 'https://ticket-api.luxdomain.work';
export const CLIENT_USER_API_BASE_URL = process.env.NEXT_PUBLIC_USER_API_BASE_URL || 'https://user-api.luxdomain.work';

/**
 * Label interface for ticket API integration
 */
export interface Label {
  id: number;
  name: string;
  color: string;
}

/*
 * Ticket interface for ticket API integration
 */
export interface Ticket {
  id: number;
  title: string;
  desc?: string;
  dueDate?: string;
  url?: string;
  labels?: string[];
  assignees?: string[];
}

/**
 * Content item interface for API responses and requests
 */
export interface ContentItem {
  id?: number;
  title: string;
  subject?: string;
  topic?: string;
  // Either projectId (for requests) or project (for responses/requests)
  projectId?: number;
  project?: {
    id: number;
    name: string;
    color?: string;
  };
  // Required fields
  personResponsibleId: string;
  // New required array fields for the simplified structure
  contentTypeIds?: number[];
  personaIds?: number[];
  labelIds?: number[];
  // Optional fields
  gitlabIssueUrl?: string | null;
  gitlabId?: number | null;
  lifecycleStage?: string;
  status?: string;
  // Labels from ticket API
  labels?: Label[];
  // Used in API for relationships - deprecated in favor of labels
  personas?: { id: number; name: string }[];
  channels?: { id: number; name: string }[];
  // Deprecated - use project/labels directly
  channelIds?: number[];
  publicationDate?: string;
  // Additional optional fields
  date?: string;
  bookmarked?: boolean;
  tags?: string[];
  description?: string;
  location?: string;
  owners?: string[];
  topics?: string[];
  department?: string;
  gitlabLink?: string;
  startTime?: string;
  endTime?: string;
  timezone?: string;
  participants?: string[];
  content?: string;
} 