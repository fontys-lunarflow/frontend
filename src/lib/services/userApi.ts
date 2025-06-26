import { CLIENT_USER_API_BASE_URL } from '../config/api';

/**
 * User interface based on user API documentation
 */
export interface User {
  id: string; // Keycloak ID
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  groups?: string[];
  enabled?: boolean;
}

/**
 * User group interface
 */
export interface UserGroup {
  name: string;
  users: User[];
}

/**
 * Fetches all users from the user API
 */
export async function fetchAllUsers(): Promise<User[]> {
  try {
    console.log('User API: Fetching all users from:', `${CLIENT_USER_API_BASE_URL}/api/user/all`);
    
    const response = await fetch(`${CLIENT_USER_API_BASE_URL}/api/user/all`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });
    
    console.log('User API: Response status:', response.status);
    
    if (!response.ok) {
      // If we get a 404 or other error, fall back to mock users for development
      if (response.status === 404 || response.status >= 500) {
        console.warn('User API: Not accessible, using mock users for development');
        return getMockUsers();
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const users: User[] = await response.json();
    console.log('User API: Fetched users successfully, count:', users?.length || 0);
    return users || [];
  } catch (error) {
    console.error('User API: Failed to fetch users, using mock users:', error);
    return getMockUsers();
  }
}

/**
 * Fetches a specific user by their Keycloak ID
 */
export async function fetchUserById(id: string): Promise<User | null> {
  try {
    console.log('User API: Fetching user by ID:', id);
    
    const response = await fetch(`${CLIENT_USER_API_BASE_URL}/api/user/id/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });
    
    console.log('User API: Response status:', response.status);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.warn('User API: User not found with ID:', id);
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const user: User = await response.json();
    console.log('User API: Fetched user successfully:', user);
    return user;
  } catch (error) {
    console.error('User API: Failed to fetch user by ID:', error);
    return null;
  }
}

/**
 * Fetches a user by their username
 */
export async function fetchUserByUsername(username: string): Promise<User | null> {
  try {
    console.log('User API: Fetching user by username:', username);
    
    const response = await fetch(`${CLIENT_USER_API_BASE_URL}/api/user/username/${username}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });
    
    console.log('User API: Response status:', response.status);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.warn('User API: User not found with username:', username);
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const user: User = await response.json();
    console.log('User API: Fetched user successfully:', user);
    return user;
  } catch (error) {
    console.error('User API: Failed to fetch user by username:', error);
    return null;
  }
}

/**
 * Fetches all users who belong to a specific group
 */
export async function fetchUsersByGroup(groupName: string): Promise<User[]> {
  try {
    console.log('User API: Fetching users by group:', groupName);
    
    const response = await fetch(`${CLIENT_USER_API_BASE_URL}/api/user/group/${groupName}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });
    
    console.log('User API: Response status:', response.status);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.warn('User API: Group not found:', groupName);
        return [];
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const users: User[] = await response.json();
    console.log('User API: Fetched users by group successfully, count:', users?.length || 0);
    return users || [];
  } catch (error) {
    console.error('User API: Failed to fetch users by group:', error);
    return [];
  }
}

/**
 * Returns mock users for development when User API is not accessible
 */
function getMockUsers(): User[] {
  return [
    {
      id: "user-001",
      username: "john.doe",
      email: "john.doe@company.com",
      firstName: "John",
      lastName: "Doe",
      groups: ["content-creators", "editors"],
      enabled: true
    },
    {
      id: "user-002", 
      username: "jane.smith",
      email: "jane.smith@company.com",
      firstName: "Jane",
      lastName: "Smith",
      groups: ["content-creators", "reviewers"],
      enabled: true
    },
    {
      id: "user-003",
      username: "mike.johnson",
      email: "mike.johnson@company.com", 
      firstName: "Mike",
      lastName: "Johnson",
      groups: ["editors", "admins"],
      enabled: true
    },
    {
      id: "user-004",
      username: "sarah.wilson",
      email: "sarah.wilson@company.com",
      firstName: "Sarah", 
      lastName: "Wilson",
      groups: ["content-creators"],
      enabled: true
    },
    {
      id: "user-005",
      username: "david.brown",
      email: "david.brown@company.com",
      firstName: "David",
      lastName: "Brown", 
      groups: ["reviewers", "editors"],
      enabled: true
    }
  ];
} 