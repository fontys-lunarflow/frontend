'use server';

import { ContentItem, API_BASE_URL } from '../config/api';

/**
 * Interface for content item filters
 */
export interface ContentFilters {
  labelIds?: number[];
  publicationDateStart?: string;
  publicationDateEnd?: string;
  statuses?: string[];
  lifecycleStages?: string[];
  projectIds?: number[];
  contentTypeIds?: number[];
  personaIds?: number[];
}

/**
 * Builds query string from filter parameters
 */
function buildQueryString(filters: ContentFilters): string {
  const params = new URLSearchParams();
  
  // Handle array parameters (multiple values)
  if (filters.labelIds?.length) {
    filters.labelIds.forEach(id => params.append('labelIds', id.toString()));
  }
  
  if (filters.statuses?.length) {
    filters.statuses.forEach(status => params.append('statuses', status));
  }
  
  if (filters.lifecycleStages?.length) {
    filters.lifecycleStages.forEach(stage => params.append('lifecycleStages', stage));
  }
  
  if (filters.projectIds?.length) {
    filters.projectIds.forEach(id => params.append('projectIds', id.toString()));
  }
  
  if (filters.contentTypeIds?.length) {
    filters.contentTypeIds.forEach(id => params.append('contentTypeIds', id.toString()));
  }
  
  if (filters.personaIds?.length) {
    filters.personaIds.forEach(id => params.append('personaIds', id.toString()));
  }
  
  // Handle single value parameters
  if (filters.publicationDateStart) {
    params.append('publicationDateStart', filters.publicationDateStart);
  }
  
  if (filters.publicationDateEnd) {
    params.append('publicationDateEnd', filters.publicationDateEnd);
  }
  
  return params.toString();
}

/**
 * Fetches all content items from the API with optional filters
 */
export async function getAllContentItems(filters?: ContentFilters): Promise<ContentItem[]> {
  try {
    let url = `${API_BASE_URL}/content-items`;
    
    // Add query parameters if filters are provided
    if (filters) {
      const queryString = buildQueryString(filters);
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    
    console.log('Server: Fetching content items from:', url);
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
      // Ensure fresh data
      cache: 'no-store'
    });
    
    if (!response.ok) {
      let errorMessage = `Server error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If we can't parse the error as JSON, use the status text
      }
      throw new Error(errorMessage);
    }
    
    const items = await response.json();
    console.log('Server: Fetched content items successfully');
    return items;
  } catch (error) {
    console.error('Server: Failed to fetch content items:', error);
    throw error;
  }
}

/**
 * Creates a new content item via the API
 */
export async function createContentItem(contentItem: ContentItem): Promise<ContentItem> {
  try {
    console.log('Server: Creating content item:', contentItem);
    
    const response = await fetch(`${API_BASE_URL}/content-items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(contentItem),
    });
    
    if (!response.ok) {
      let errorMessage = `Server error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        console.error('Server returned error data:', errorData);
        errorMessage = errorData.message || errorMessage;
      } catch (parseError) {
        // If we can't parse the error as JSON, use the status text
        console.error('Failed to parse error response:', parseError);
      }
      throw new Error(errorMessage);
    }
    
    const createdItem = await response.json();
    console.log('Server: Created content item successfully:', createdItem);
    return createdItem;
  } catch (error) {
    console.error('Server: Failed to create content item:', error);
    throw error;
  }
}

/**
 * Deletes a content item via the API
 */
export async function deleteContentItem(id: number): Promise<void> {
  try {
    console.log('Server: Deleting content item with id:', id);
    
    const response = await fetch(`${API_BASE_URL}/content-items/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      let errorMessage = `Server error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If we can't parse the error as JSON, use the status text
      }
      throw new Error(errorMessage);
    }
    
    console.log('Server: Successfully deleted content item with id:', id);
  } catch (error) {
    console.error('Server: Failed to delete content item:', error);
    throw error;
  }
}

/**
 * Fetches a content item by ID from the API
 */
export async function getContentItemById(id: number): Promise<ContentItem> {
  try {
    console.log('Server: Fetching content item with id:', id);
    
    const response = await fetch(`${API_BASE_URL}/content-items/${id}`, {
      headers: {
        'Accept': 'application/json',
      },
      // Ensure fresh data
      cache: 'no-store'
    });
    
    if (!response.ok) {
      let errorMessage = `Server error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If we can't parse the error as JSON, use the status text
      }
      throw new Error(errorMessage);
    }
    
    const item = await response.json();
    console.log('Server: Fetched content item successfully');
    return item;
  } catch (error) {
    console.error('Server: Failed to fetch content item:', error);
    throw error;
  }
}

/**
 * Updates a content item via the API
 */
export async function updateContentItem(id: number, contentItem: ContentItem): Promise<ContentItem> {
  try {
    console.log('Server: Updating content item with id:', id);
    
    const response = await fetch(`${API_BASE_URL}/content-items/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(contentItem),
    });
    
    if (!response.ok) {
      let errorMessage = `Server error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If we can't parse the error as JSON, use the status text
      }
      throw new Error(errorMessage);
    }
    
    const updatedItem = await response.json();
    console.log('Server: Updated content item successfully');
    return updatedItem;
  } catch (error) {
    console.error('Server: Failed to update content item:', error);
    throw error;
  }
}

/**
 * Project interface for API responses
 */
export interface Project {
  id: number;
  name: string;
  color?: string;
  description?: string;
}

/**
 * ContentType interface for API responses
 */
export interface ContentType {
  id: number;
  name: string;
}

/**
 * Fetches all projects from the API
 */
export async function getAllProjects(): Promise<Project[]> {
  try {
    console.log('Server: Fetching all projects');
    
    const response = await fetch(`${API_BASE_URL}/projects`, {
      headers: {
        'Accept': 'application/json',
      },
      // Ensure fresh data
      cache: 'no-store'
    });
    
    if (!response.ok) {
      let errorMessage = `Server error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If we can't parse the error as JSON, use the status text
      }
      throw new Error(errorMessage);
    }
    
    const projects = await response.json();
    console.log('Server: Fetched projects successfully');
    return projects;
  } catch (error) {
    console.error('Server: Failed to fetch projects:', error);
    throw error;
  }
}

/**
 * Fetches all content types from the API
 */
export async function getAllContentTypes(): Promise<ContentType[]> {
  try {
    console.log('Server: Fetching all content types');
    
    const response = await fetch(`${API_BASE_URL}/content-types`, {
      headers: {
        'Accept': 'application/json',
      },
      // Ensure fresh data
      cache: 'no-store'
    });
    
    if (!response.ok) {
      let errorMessage = `Server error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If we can't parse the error as JSON, use the status text
      }
      throw new Error(errorMessage);
    }
    
    const contentTypes = await response.json();
    console.log('Server: Fetched content types successfully');
    return contentTypes;
  } catch (error) {
    console.error('Server: Failed to fetch content types:', error);
    throw error;
  }
} 