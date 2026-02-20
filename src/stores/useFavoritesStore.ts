import { create } from 'zustand';

interface FavoritesStore {
  favorites: string[]; // unitCodes
  toggleFavorite: (unitCode: string) => void;
  isFavorite: (unitCode: string) => boolean;
}

export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
  favorites:
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('favorites') || '[]')
      : [],
  toggleFavorite: (unitCode) => {
    set((state) => {
      const exists = state.favorites.includes(unitCode);
      const updated = exists
        ? state.favorites.filter((f) => f !== unitCode)
        : [...state.favorites, unitCode];
      if (typeof window !== 'undefined') {
        localStorage.setItem('favorites', JSON.stringify(updated));
      }
      return { favorites: updated };
    });
  },
  isFavorite: (unitCode) => get().favorites.includes(unitCode),
}));
