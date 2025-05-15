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
  // New fields
  personResponsibleId?: string;
  gitlabIssueUrl?: string | null;
  gitlabId?: number | null;
  lifecycleStage?: string;
  status?: string;
  personas?: string[];
  channels?: string[];
  publicationDate?: string;
  // Project object (populated in responses)
  project?: {
    id: number;
    name: string;
    color?: string;
  };
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