import { CLIENT_TICKET_API_BASE_URL } from '../config/api';

/**
 * Label interface based on ticket API documentation
 */
export interface Label {
  id: number;
  name: string;
  color: string;
}

// Ticket interface from ticket API documentation
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
 * Response wrapper from ticket API
 */
interface ApiResponse<T> {
  error: boolean;
  mesg?: string;
  data?: T;
}

/**
 * Creates a new ticket in the ticket API
 */
export async function createTicket(ticket: Omit<Ticket, 'id'>): Promise<Ticket> {
  try {
    console.log('Ticket API: Creating ticket:', ticket);
    
    const response = await fetch(`${CLIENT_TICKET_API_BASE_URL}/api/ticket/create`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: 0, ...ticket }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: ApiResponse<Ticket> = await response.json();
    
    if (result.error) {
      throw new Error(result.mesg || 'Unknown error from ticket API');
    }
    
    if (!result.data) {
      throw new Error('No data returned from ticket API');
    }
    
    console.log('Ticket API: Created ticket successfully:', result.data);
    return result.data;
  } catch (error) {
    console.error('Ticket API: Failed to create ticket:', error);
    throw error;
  }
}

/**
 * Fetches all available tickets from the ticket API
 */
export async function readTicket(ticket: Ticket): Promise<Ticket> {
  try {
    console.log('Ticket API: Fetching tickets from:', `${CLIENT_TICKET_API_BASE_URL}/api/ticket/read`);
    
    const response = await fetch(`${CLIENT_TICKET_API_BASE_URL}/api/ticket/read`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticket),
    });
    
    console.log('Ticket API: Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: ApiResponse<Ticket> = await response.json();

    if (!result.data) {
      throw new Error(result.mesg);
    }
    
    return result.data;
  } catch (error) {
    console.error('Ticket API: Failed to fetch labels:', error);
    throw error;
  }
}

/**
 * Fetches all available tickets from the ticket API
 */
export async function setLabels(ticket: Ticket): Promise<Ticket> {
  try {
    console.log('Ticket API: Fetching tickets from:', `${CLIENT_TICKET_API_BASE_URL}/api/ticket/setlabels`);
    
    const response = await fetch(`${CLIENT_TICKET_API_BASE_URL}/api/ticket/setlabels`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticket),
    });
    
    console.log('Ticket API: Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: ApiResponse<Ticket> = await response.json();
    
    if (result.error) {
      throw new Error(result.mesg || 'Unknown error from ticket API');
    }
    
    if (!result.data) {
      throw new Error(result.mesg);
    }
    return result.data;
  } catch (error) {
    console.error('Ticket API: Failed to fetch labels:', error);
    throw error;
  }
}

/**
 * Fetches all available labels from the ticket API
 */
export async function fetchLabels(): Promise<Label[]> {
  try {
    console.log('Ticket API: Fetching labels from:', `${CLIENT_TICKET_API_BASE_URL}/api/labels/list`);
    
    const response = await fetch(`${CLIENT_TICKET_API_BASE_URL}/api/labels/list`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });
    
    console.log('Ticket API: Response status:', response.status);
    
    if (!response.ok) {
      // If we get a 401 or other error, fall back to mock labels for development
      if (response.status === 401) {
        console.warn('Ticket API: 401 Unauthorized - GitLab not configured, using mock labels');
        return getMockLabels();
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: ApiResponse<Label[]> = await response.json();
    
    if (result.error) {
      console.warn('Ticket API: Error response, falling back to mock labels:', result.mesg);
      return getMockLabels();
    }
    
    console.log('Ticket API: Fetched labels successfully, count:', result.data?.length || 0);
    return result.data || [];
  } catch (error) {
    console.error('Ticket API: Failed to fetch labels, using mock labels:', error);
    return getMockLabels();
  }
}

/**
 * Returns mock labels for development when GitLab is not configured
 */
function getMockLabels(): Label[] {
  return [
    { id: 1, name: "Bug", color: "#d73a4a" },
    { id: 2, name: "Enhancement", color: "#a2eeef" },
    { id: 3, name: "Documentation", color: "#0075ca" },
    { id: 4, name: "Good First Issue", color: "#7057ff" },
    { id: 5, name: "Help Wanted", color: "#008672" },
    { id: 6, name: "Priority: High", color: "#ff6b6b" },
    { id: 7, name: "Priority: Medium", color: "#ffa726" },
    { id: 8, name: "Priority: Low", color: "#66bb6a" },
    { id: 9, name: "Status: In Progress", color: "#1976d2" },
    { id: 10, name: "Status: Ready", color: "#4caf50" },
    { id: 11, name: "Type: Feature", color: "#9c27b0" },
    { id: 12, name: "Type: Refactor", color: "#795548" }
  ];
}

/**
 * Creates a new label in the ticket API
 */
export async function createLabel(label: Omit<Label, 'id'>): Promise<Label> {
  try {
    console.log('Ticket API: Creating label:', label);
    
    const response = await fetch(`${CLIENT_TICKET_API_BASE_URL}/api/labels/create`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: 0, ...label }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: ApiResponse<Label> = await response.json();
    
    if (result.error) {
      throw new Error(result.mesg || 'Unknown error from ticket API');
    }
    
    if (!result.data) {
      throw new Error('No data returned from ticket API');
    }
    
    console.log('Ticket API: Created label successfully:', result.data);
    return result.data;
  } catch (error) {
    console.error('Ticket API: Failed to create label:', error);
    throw error;
  }
}

/**
 * Deletes a label from the ticket API
 */
export async function deleteLabel(label: Label): Promise<void> {
  try {
    console.log('Ticket API: Deleting label:', label);
    
    const response = await fetch(`${CLIENT_TICKET_API_BASE_URL}/api/labels/delete`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(label),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: ApiResponse<Label> = await response.json();
    
    if (result.error) {
      throw new Error(result.mesg || 'Unknown error from ticket API');
    }
    
    console.log('Ticket API: Deleted label successfully');
  } catch (error) {
    console.error('Ticket API: Failed to delete label:', error);
    throw error;
  }
} 