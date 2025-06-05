'use server';

import { getAllContentItems, createContentItem, deleteContentItem, getContentItemById, updateContentItem, getAllProjects, ContentFilters } from '@/lib/services/contentApi';
import { ContentItem } from '@/lib/config/api';
import { revalidatePath } from 'next/cache';

/**
 * Server action to fetch all content items with optional filters
 */
export async function fetchContentItems(filters?: ContentFilters) {
  try {
    const contentItems = await getAllContentItems(filters);
    return { success: true, data: contentItems };
  } catch (error) {
    console.error('Action: Error fetching content items:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch content items' 
    };
  }
}

/**
 * Server action to create a new content item
 */
export async function createNewContentItem(formData: ContentItem) {
  try {
    const newItem = await createContentItem(formData);
    // Revalidate the content page to show updated data
    revalidatePath('/');
    return { success: true, data: newItem };
  } catch (error) {
    console.error('Action: Error creating content item:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create content item' 
    };
  }
}

/**
 * Server action to delete a content item
 */
export async function deleteContentItemById(id: number) {
  try {
    await deleteContentItem(id);
    // Revalidate the content page to show updated data
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Action: Error deleting content item:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete content item' 
    };
  }
}

/**
 * Server action to fetch a content item by ID
 */
export async function getContentItem(id: number) {
  try {
    const contentItem = await getContentItemById(id);
    return { success: true, data: contentItem };
  } catch (error) {
    console.error('Action: Error fetching content item:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch content item' 
    };
  }
}

/**
 * Server action to update a content item
 */
export async function updateContentItemById(id: number, formData: ContentItem) {
  try {
    const updatedItem = await updateContentItem(id, formData);
    // Revalidate the content page to show updated data
    revalidatePath('/');
    return { success: true, data: updatedItem };
  } catch (error) {
    console.error('Action: Error updating content item:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update content item' 
    };
  }
}

/**
 * Server action to fetch all projects
 */
export async function fetchProjects() {
  try {
    const projects = await getAllProjects();
    return { success: true, data: projects };
  } catch (error) {
    console.error('Action: Error fetching projects:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch projects' 
    };
  }
} 