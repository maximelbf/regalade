import Header from '../components/Header'
import Banner from '../components/Banner'
import { RecipesScrollbar } from '../components/RecipesScrollbar'

interface HomePageProps {
  isLoggedIn: boolean
  onLoginToggle: () => void
}

export default function HomePage({ isLoggedIn, onLoginToggle }: HomePageProps) {
  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      <Header isLoggedIn={isLoggedIn} onLoginToggle={onLoginToggle} />
      <Banner />
      <RecipesScrollbar />
    </div>
  )
}
