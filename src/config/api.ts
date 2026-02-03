/**
 * Configuration globale pour l'application
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const config = {
  api: {
    baseUrl: API_BASE_URL,
    endpoints: {
      search: '/search',
      login: '/login',
      logout: '/logout',
      me: '/me',
      recipes: '/recipes',
      recipesById: (id: string) => `/recipes/${id}`,
      favorites: '/favorites',
      userFavorites: (username: string) => `/users/${username}/favorites`,
    },
  },
  app: {
    name: 'Regalade',
  },
}

/**
 * Fonction utilitaire pour construire les URLs de l'API
 */
export const buildApiUrl = (endpoint: string): string => {
  return `${config.api.baseUrl}${endpoint}`
}

/**
 * Fonction utilitaire pour les requêtes API avec gestion des erreurs
 */
export const fetchApi = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const url = buildApiUrl(endpoint)
  try {
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        Accept: 'application/json',
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    })

    if (!response.ok) {
      let errorMessage = `Erreur HTTP ${response.status}: ${response.statusText}`

      try {
        const error = await response.json()
        errorMessage = error.detail || errorMessage
      } catch {
        try {
          const text = await response.text()
          if (text) {
            errorMessage = text.substring(0, 200)
          }
        } catch {
          console.error("[fetchApi] Impossible de lire le corps de la réponse d'erreur")
        }
      }

      throw new Error(errorMessage)
    }

    // Vérifier si la réponse a du contenu avant de parser le JSON
    const contentType = response.headers.get('content-type')
    const contentLength = response.headers.get('content-length')

    // Si la réponse est vide ou n'est pas du JSON, retourner null
    if (contentLength === '0' || !contentType?.includes('application/json')) {
      const text = await response.text()
      if (!text || text.trim() === '') {
        return null as T
      }
    }

    // Parser la réponse JSON
    const json = await response.json()
    return json
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error("[fetchApi] Erreur de parsing JSON - la réponse n'est pas du JSON valide")
    }
    if (error instanceof TypeError) {
      console.error("[fetchApi] Erreur réseau - impossible d'atteindre l'API")
    }
    console.error('[fetchApi] Erreur:', error instanceof Error ? error.message : String(error))
    throw error
  }
}
