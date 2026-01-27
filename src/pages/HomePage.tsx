import Header from '../components/Header'
import Navigation from '../components/Navigation'
import Banner from '../components/Banner'

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

      {/* Main Content Area */}
      <main className="w-full px-8 py-12 mt-6">
        {/* TODO: Add featured recipes section here */}
      </main>
    </div>
  )
}
