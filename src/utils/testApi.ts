/**
 * Utilitaire de test pour debugguer l'API
 * À exécuter dans la console du navigateur
 */

export const testApi = async () => {
  const baseUrl = 'https://gourmet.cours.quimerch.com'
  const endpoints = [
    '/recipes',
    '/recipes?limit=1',
    '/',
    '/api/recipes',
    '/recipes/',
  ]

  console.log('🧪 Test des endpoints API...\n')

  for (const endpoint of endpoints) {
    const url = baseUrl + endpoint
    try {
      const response = await fetch(url)
      const contentType = response.headers.get('content-type')
      const status = response.status

      console.log(`\n📍 ${endpoint}`)
      console.log(`   Status: ${status}`)
      console.log(`   Content-Type: ${contentType}`)

      if (status === 200) {
        const text = await response.text()
        const preview = text.substring(0, 200)
        console.log(`   Preview: ${preview}`)

        // Essayer de parser en JSON
        try {
          const json = JSON.parse(text)
          console.log(`   ✅ JSON valide (${Array.isArray(json) ? 'array' : 'object'})`)
          console.log(`   Keys:`, Array.isArray(json) ? json[0] && Object.keys(json[0]) : Object.keys(json))
        } catch {
          console.log(`   ❌ Pas du JSON valide`)
        }
      } else {
        console.log(`   ❌ Erreur HTTP`)
      }
    } catch (error) {
      console.log(`\n📍 ${endpoint}`)
      console.log(`   ❌ Erreur réseau:`, error)
    }
  }
}

// Exécuter: testApi()
