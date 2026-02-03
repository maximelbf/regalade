import { config, fetchApi } from '../config/api'
import type { Recipe } from '../types'

class FavoritesService {
  private favoritesCache: Recipe[] | null = null
  private cacheTimestamp: number | null = null
  private readonly CACHE_DURATION = 2 * 60 * 1000 // 2 minutes en millisecondes
  private readonly STORAGE_KEY = 'favorites_cache'
  private readonly TIMESTAMP_KEY = 'favorites_cache_timestamp'

  constructor() {
    // Restaurer le cache depuis sessionStorage au démarrage
    this.loadCacheFromStorage()
  }

  private loadCacheFromStorage(): void {
    try {
      const cachedData = sessionStorage.getItem(this.STORAGE_KEY)
      const timestamp = sessionStorage.getItem(this.TIMESTAMP_KEY)

      if (cachedData && timestamp) {
        this.favoritesCache = JSON.parse(cachedData)
        this.cacheTimestamp = parseInt(timestamp, 10)
      }
    } catch (err) {
      console.error('Error loading favorites cache from storage:', err)
    }
  }

  private saveCacheToStorage(): void {
    try {
      if (this.favoritesCache && this.cacheTimestamp) {
        sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.favoritesCache))
        sessionStorage.setItem(this.TIMESTAMP_KEY, this.cacheTimestamp.toString())
      }
    } catch (err) {
      console.error('Error saving favorites cache to storage:', err)
    }
  }

  private isCacheValid(): boolean {
    if (!this.favoritesCache || !this.cacheTimestamp) {
      return false
    }
    const now = Date.now()
    return now - this.cacheTimestamp < this.CACHE_DURATION
  }

  clearCache(): void {
    this.favoritesCache = null
    this.cacheTimestamp = null
    sessionStorage.removeItem(this.STORAGE_KEY)
    sessionStorage.removeItem(this.TIMESTAMP_KEY)
  }

  async getFavorites(forceRefresh: boolean = false): Promise<Recipe[]> {
    if (!forceRefresh && this.isCacheValid() && this.favoritesCache) {
      return this.favoritesCache
    }

    const response = await fetchApi<Array<{ recipe: Recipe }>>(config.api.endpoints.favorites, {
      method: 'GET',
    })

    const favorites = response.map(item => item.recipe)

    this.favoritesCache = favorites
    this.cacheTimestamp = Date.now()
    this.saveCacheToStorage()

    return favorites
  }

  addToCache(recipe: Recipe): void {
    if (!this.favoritesCache) {
      // Si le cache n'existe pas, l'initialiser avec cette recette
      this.favoritesCache = [recipe]
      this.cacheTimestamp = Date.now()
    } else {
      const exists = this.favoritesCache.some(r => r.id === recipe.id)
      if (!exists) {
        this.favoritesCache = [...this.favoritesCache, recipe]
        this.cacheTimestamp = Date.now()
      }
    }
    this.saveCacheToStorage()
  }

  removeFromCache(recipeId: string): void {
    if (this.favoritesCache) {
      this.favoritesCache = this.favoritesCache.filter(r => r.id !== recipeId)
      this.cacheTimestamp = Date.now()
      this.saveCacheToStorage()
    }
  }

  async isRecipeFavorite(recipeId: string): Promise<boolean> {
    const favorites = await this.getFavorites()
    return favorites.some(r => r.id === recipeId)
  }
}

export const favoritesService = new FavoritesService()
