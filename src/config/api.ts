/**
 * Configuration globale pour l'application
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8083'

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
      ingredients: '/ingredients',
      admin: '/admin',
    },
  },
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Gourmet',
    version: import.meta.env.VITE_APP_VERSION || '0.0.1',
  },
  features: {
    adminPanel: import.meta.env.VITE_ENABLE_ADMIN_PANEL === 'true',
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
export const fetchApi = async <T,>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = buildApiUrl(endpoint)
  
  console.log('[fetchApi] 🔄 Requête vers:', url)

  try {
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    })
    
    console.log('[fetchApi] 📍 Status:', response.status)
    console.log('[fetchApi] 📄 Content-Type:', response.headers.get('content-type'))

    // Vérifier le statut HTTP d'abord
    if (!response.ok) {
      let errorMessage = `Erreur HTTP ${response.status}: ${response.statusText}`
      
      try {
        const error = await response.json()
        errorMessage = error.detail || errorMessage
      } catch {
        // Essayer de récupérer le texte brut comme fallback
        try {
          const text = await response.text()
          if (text) {
            errorMessage = text.substring(0, 200)
          }
        } catch {}
      }
      
      throw new Error(errorMessage)
    }

    // Parser la réponse JSON
    const json = await response.json()
    console.log('[fetchApi] ✅ JSON reçu:', Array.isArray(json) ? `Array de ${json.length} éléments` : 'Objet')
    return json
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error('[fetchApi] ❌ Erreur de parsing JSON - la réponse n\'est pas du JSON valide')
    }
    if (error instanceof TypeError) {
      console.error('[fetchApi] ❌ Erreur réseau - impossible d\'atteindre l\'API')
    }
    console.error('[fetchApi] ❌ Erreur:', error instanceof Error ? error.message : String(error))
    throw error
  }
}
