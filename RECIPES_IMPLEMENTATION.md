# Barre de Navigation de Recettes - Implémentation

## 📋 Résumé des modifications

J'ai ajouté une barre de navigation scrollable horizontale sur la page d'accueil qui affiche les recettes de l'API.

### 📁 Fichiers créés

#### 1. `src/components/RecipeCard.tsx`
Composant pour afficher une vignette de recette avec :
- **Image** de la recette (avec fallback en cas d'erreur)
- **Nom** de la recette
- **Description** de la recette
- **Effet hover** : agrandissement de l'image et élévation de la carte
- **Cliquable** : navigation vers `/recettes/{recipeId}`

**Props** :
- `id` : ID de la recette
- `name` : Nom de la recette
- `description` : Description de la recette
- `imageUrl` : URL de l'image
- `onRecipeClick?` : Callback optionnel pour la navigation

#### 2. `src/components/RecipesScrollbar.tsx`
Composant principal pour la barre de recettes scrollable :

**Fonctionnalités** :
- ✅ Récupère les recettes via l'API (`GET /recipes?limit=12`)
- ✅ Affiche les recettes dans un conteneur scrollable horizontalement
- ✅ Flèches de navigation (gauche/droite) pour scroller
- ✅ Gestion du chargement (spinner)
- ✅ Gestion des erreurs
- ✅ Détection automatique de la position du scroll (affiche/cache les flèches)
- ✅ Animation smooth du scroll
- ✅ Design responsive et élégant

### 📝 Fichiers modifiés

#### `src/App.tsx`
Modifications :
- Import du composant `RecipesScrollbar`
- Ajout du composant dans la section principale (après la bannière)
- Ajout de la fonction `handleRecipeClick()` pour la navigation

## 🎨 Design et Styling

### Barre de recettes
- **Titre** : "Recettes à découvrir" avec gradient indigo → purple
- **Sous-titre** : "Faites défiler pour explorer nos recettes"
- **Conteneur** : Scrollable horizontalement avec gap de 1.5rem entre les cartes

### Cartes de recettes
- **Dimensions** : 256px de largeur (w-64)
- **Image** : 160px de hauteur (h-40) avec zoom au hover
- **Contenu** : Padding de 1rem avec titre et description
- **Effet hover** : 
  - Ombre augmentée
  - Élévation légère (-translate-y-1)
  - Image agrandie de 110%
  - Curseur changé en pointer

### Flèches de navigation
- **Position** : Absolue à gauche/droite du conteneur
- **Apparence** : Boutons circulaires blancs semi-transparents
- **Effets** : 
  - Hover : Opacité complète + agrandissement
  - Transitions lisses
- **Icônes** : SVG chevrons indigo

## 🔄 Flux de données

```
API (/recipes?limit=12)
    ↓
RecipesScrollbar (fetch + state management)
    ↓
RecipeCard (affichage × multiple)
    ↓
Navigation vers /recettes/{id}
```

## 🚀 Utilisation

### Accès à la barre
La barre s'affiche automatiquement sur la page d'accueil, après la bannière principale.

### Défilement
- **Flèches** : Cliquez sur les flèches pour scroller automatiquement
- **Scroll manuel** : Utilisez la molette de la souris ou le trackpad pour scroller
- **Mobile** : Swipe pour scroller

### Navigation
Cliquez sur une carte pour aller à `/recettes/{recipeId}` (page à implémenter ultérieurement)

## 🔍 Points techniques

### API utilisée
- **Endpoint** : `GET /recipes`
- **Paramètres** : `limit=12` (limite à 12 recettes)
- **Format réponse** : Array de Recipe objects avec :
  - `id` (string)
  - `name` (string)
  - `description` (string)
  - `image_url` (string)
  - Autres propriétés (prep_time, cook_time, servings, etc.)

### Gestion des erreurs
- **Erreur de chargement** : Affiche un message d'erreur en rouge
- **Image manquante** : Fallback vers une image placeholder
- **Pas de recettes** : Message "Aucune recette disponible"

### Optimisations
- **Lazy loading** : Les images sont chargées à la demande
- **Error handling** : Graceful degradation avec placeholders
- **Performance** : Limitation à 12 recettes avec `limit=12`

## 📱 Responsive

La barre est entièrement responsive :
- **Desktop** : Affiche tous les éléments normalement
- **Tablet** : Les cartes s'adaptent
- **Mobile** : Scroll horizontal natif, flèches visibles si nécessaire

## 🎯 Prochaines étapes

1. Créer la page de détail `/recettes/{id}` (page indépendante)
2. Ajouter la pagination ou "Load More"
3. Intégrer des filtres (catégories, temps de préparation, etc.)
4. Ajouter un système de favoris (avec cœur sur les cartes)
5. Implémenter le système de notations

## ✅ Statut

- ✅ Composants créés et intégrés
- ✅ API integration fonctionnelle
- ✅ Design et animations implémentées
- ✅ Gestion d'erreurs complète
- ✅ Aucune erreur TypeScript
- ⏳ Page de détail recette (à faire)
