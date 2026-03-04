/**
 * User Cards Storage
 *
 * localStorage persistence for user-created AAC cards.
 * Provides methods for CRUD operations on custom cards.
 */

import type { AACCard, UserCardLibrary } from '@/types/aac';

const STORAGE_KEY = '8gent-jr-user-cards';
const MAX_CARDS = 500; // Limit to prevent localStorage overflow

/**
 * Get the user's card library from localStorage
 */
export function getUserCardLibrary(): UserCardLibrary | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as UserCardLibrary;
  } catch (error) {
    console.error('Failed to load user cards:', error);
    return null;
  }
}

/**
 * Initialize or get the user's card library
 */
export function getOrCreateUserCardLibrary(userId: string = 'default'): UserCardLibrary {
  const existing = getUserCardLibrary();
  if (existing) return existing;

  const newLibrary: UserCardLibrary = {
    userId,
    cards: [],
    favorites: [],
    recentlyUsed: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  saveUserCardLibrary(newLibrary);
  return newLibrary;
}

/**
 * Save the user's card library to localStorage
 */
export function saveUserCardLibrary(library: UserCardLibrary): boolean {
  if (typeof window === 'undefined') return false;

  try {
    library.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
    return true;
  } catch (error) {
    console.error('Failed to save user cards:', error);
    return false;
  }
}

/**
 * Add a new card to the user's library
 */
export function addUserCard(card: AACCard): { success: boolean; error?: string } {
  const library = getOrCreateUserCardLibrary();

  // Check card limit
  if (library.cards.length >= MAX_CARDS) {
    return { success: false, error: `Maximum ${MAX_CARDS} cards reached` };
  }

  // Check for duplicate ID
  if (library.cards.some((c) => c.id === card.id)) {
    return { success: false, error: 'Card with this ID already exists' };
  }

  // Ensure it's marked as custom
  const customCard: AACCard = {
    ...card,
    isCustom: true,
    createdAt: card.createdAt || new Date().toISOString(),
  };

  library.cards.push(customCard);
  const saved = saveUserCardLibrary(library);

  return saved
    ? { success: true }
    : { success: false, error: 'Failed to save to storage' };
}

/**
 * Update an existing card
 */
export function updateUserCard(cardId: string, updates: Partial<AACCard>): boolean {
  const library = getUserCardLibrary();
  if (!library) return false;

  const index = library.cards.findIndex((c) => c.id === cardId);
  if (index === -1) return false;

  library.cards[index] = { ...library.cards[index], ...updates };
  return saveUserCardLibrary(library);
}

/**
 * Delete a card from the user's library
 */
export function deleteUserCard(cardId: string): boolean {
  const library = getUserCardLibrary();
  if (!library) return false;

  const index = library.cards.findIndex((c) => c.id === cardId);
  if (index === -1) return false;

  library.cards.splice(index, 1);

  // Also remove from favorites and recently used
  library.favorites = library.favorites.filter((id) => id !== cardId);
  library.recentlyUsed = library.recentlyUsed.filter((id) => id !== cardId);

  return saveUserCardLibrary(library);
}

/**
 * Get all user cards
 */
export function getAllUserCards(): AACCard[] {
  const library = getUserCardLibrary();
  return library?.cards || [];
}

/**
 * Get user cards by category
 */
export function getUserCardsByCategory(categoryId: string): AACCard[] {
  const library = getUserCardLibrary();
  if (!library) return [];
  return library.cards.filter((c) => c.categoryId === categoryId);
}

/**
 * Toggle a card as favorite
 */
export function toggleFavorite(cardId: string): boolean {
  const library = getUserCardLibrary();
  if (!library) return false;

  const index = library.favorites.indexOf(cardId);
  if (index === -1) {
    library.favorites.push(cardId);
  } else {
    library.favorites.splice(index, 1);
  }

  return saveUserCardLibrary(library);
}

/**
 * Check if a card is favorited
 */
export function isFavorite(cardId: string): boolean {
  const library = getUserCardLibrary();
  return library?.favorites.includes(cardId) || false;
}

/**
 * Mark a card as recently used
 */
export function markAsRecentlyUsed(cardId: string): boolean {
  const library = getUserCardLibrary();
  if (!library) return false;

  // Remove if already exists
  library.recentlyUsed = library.recentlyUsed.filter((id) => id !== cardId);

  // Add to front
  library.recentlyUsed.unshift(cardId);

  // Keep only last 20
  library.recentlyUsed = library.recentlyUsed.slice(0, 20);

  return saveUserCardLibrary(library);
}

/**
 * Get recently used cards
 */
export function getRecentlyUsedCards(): AACCard[] {
  const library = getUserCardLibrary();
  if (!library) return [];

  return library.recentlyUsed
    .map((id) => library.cards.find((c) => c.id === id))
    .filter((c): c is AACCard => c !== undefined);
}

/**
 * Search user cards
 */
export function searchUserCards(query: string): AACCard[] {
  const library = getUserCardLibrary();
  if (!library || !query.trim()) return [];

  const lowerQuery = query.toLowerCase();
  return library.cards.filter(
    (card) =>
      card.label.toLowerCase().includes(lowerQuery) ||
      card.speechText.toLowerCase().includes(lowerQuery) ||
      card.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Export user cards as JSON
 */
export function exportUserCards(): string {
  const library = getUserCardLibrary();
  return JSON.stringify(library, null, 2);
}

/**
 * Import user cards from JSON
 */
export function importUserCards(jsonString: string): { success: boolean; imported: number; error?: string } {
  try {
    const imported = JSON.parse(jsonString) as UserCardLibrary;

    if (!imported.cards || !Array.isArray(imported.cards)) {
      return { success: false, imported: 0, error: 'Invalid format: missing cards array' };
    }

    const library = getOrCreateUserCardLibrary();
    let importedCount = 0;

    for (const card of imported.cards) {
      if (library.cards.length >= MAX_CARDS) break;

      // Generate new ID to avoid conflicts
      const newCard: AACCard = {
        ...card,
        id: `imported-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        isCustom: true,
        createdAt: new Date().toISOString(),
      };

      library.cards.push(newCard);
      importedCount++;
    }

    const saved = saveUserCardLibrary(library);

    return saved
      ? { success: true, imported: importedCount }
      : { success: false, imported: 0, error: 'Failed to save imported cards' };
  } catch (error) {
    return { success: false, imported: 0, error: 'Invalid JSON format' };
  }
}

/**
 * Clear all user cards (use with caution!)
 */
export function clearAllUserCards(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}
