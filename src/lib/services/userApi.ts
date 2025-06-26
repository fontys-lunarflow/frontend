import { CLIENT_USER_API_BASE_URL } from '@/lib/config/api';

/**
 * User interface matching the Keycloak user-api response structure
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
      throw new Error(`Failed to fetch users: HTTP ${response.status}`);
    }
    
    const users: User[] = await response.json();
    console.log('User API: Fetched users successfully, count:', users?.length || 0);
    return users || [];
  } catch (error) {
    console.error('User API: Failed to fetch users:', error);
    throw error; // Re-throw to handle at component level
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
    
    if (response.status === 404) {
      console.warn('User API: User not found with ID:', id);
      return null;
    }
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user by ID: HTTP ${response.status}`);
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
    
    if (response.status === 404) {
      console.warn('User API: User not found with username:', username);
      return null;
    }
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user by username: HTTP ${response.status}`);
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
    
    if (response.status === 404) {
      console.warn('User API: Group not found:', groupName);
      return [];
    }
    
    if (!response.ok) {
      throw new Error(`Failed to fetch users by group: HTTP ${response.status}`);
    }
    
    const users: User[] = await response.json();
    console.log('User API: Fetched users by group successfully, count:', users?.length || 0);
    return users || [];
  } catch (error) {
    console.error('User API: Failed to fetch users by group:', error);
    return [];
  }
} 