import { ContentItem, CLIENT_API_BASE_URL } from '../config/api';
import { ContentFilters } from './contentApi';

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

// =============================================================================
// CLIENT-SIDE FUNCTIONS (for real-time filtering without page reloads)
// =============================================================================

/**
 * Client-side: Fetches all content items with optional filters
 * Use this for filtering operations to avoid page reloads
 */
export async function fetchContentItemsClient(filters?: ContentFilters): Promise<ContentItem[]> {
  try {
    let url = `${CLIENT_API_BASE_URL}/content-items`;
    
    // Add query parameters if filters are provided
    if (filters) {
      const queryString = buildQueryString(filters);
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    
    console.log('Client: Fetching content items from:', url);
    console.log('Client: Using CLIENT_API_BASE_URL:', CLIENT_API_BASE_URL);
    console.log('Client: Filters provided:', filters);
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
      // Ensure fresh data
      cache: 'no-store'
    });
    
    console.log('Client: Response status:', response.status);
    console.log('Client: Response ok:', response.ok);
    
    if (!response.ok) {
      let errorMessage = `Client error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        console.log('Client: Error response data:', errorData);
        errorMessage = errorData.message || errorMessage;
      } catch (parseError) {
        console.log('Client: Could not parse error response as JSON:', parseError);
        // If we can't parse the error as JSON, use the status text
      }
      throw new Error(errorMessage);
    }
    
    const items = await response.json();
    console.log('Client: Fetched content items successfully, count:', items?.length);
    return items;
  } catch (error) {
    console.error('Client: Failed to fetch content items:', error);
    console.error('Client: Error details:', {
      name: (error as Error)?.name,
      message: (error as Error)?.message,
      stack: (error as Error)?.stack
    });
    throw error;
  }
} 