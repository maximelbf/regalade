import Header from '../components/Header'
import Navigation from '../components/Navigation'
import Banner from '../components/Banner'
import { RecipesScrollbar } from '../components/RecipesScrollbar'
import { config } from '../config/api'

interface HomePageProps {
  isLoggedIn: boolean
  onLoginToggle: () => void
}

export default function HomePage({ isLoggedIn, onLoginToggle }: HomePageProps) {
  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      <Header isLoggedIn={isLoggedIn} onLoginToggle={onLoginToggle} />
      <Navigation />
      <Banner />
      <RecipesScrollbar />

      {/* Main Content Area */}
      <main className="w-full px-8 py-12 mt-6">
        {config.features.adminPanel && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800">
              Panneau admin activé. URL de base API:{' '}
              <code className="bg-blue-100 px-2 py-1 rounded">{config.api.baseUrl}</code>
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
