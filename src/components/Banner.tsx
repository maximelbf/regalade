import bannerImage from '../assets/banner.png'

interface BannerProps {
  title?: string
  subtitle?: string
  imageUrl?: string
}

export default function Banner({ 
  title = 'Bienvenue à Gourmet',
  subtitle = 'Découvrez des recettes délicieuses pour chaque occasion',
  imageUrl = bannerImage
}: BannerProps) {
  return (
    <section className="relative w-full h-96 bg-gradient-to-r from-indigo-500 to-purple-600 overflow-hidden">
      <img 
        src={imageUrl} 
        alt="Welcome Banner" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-black/30 flex flex-col items-center justify-center text-center text-white px-8">
        <h1 className="text-5xl font-bold mb-2 drop-shadow-lg">{title}</h1>
        <p className="text-xl drop-shadow-md font-light">{subtitle}</p>
      </div>
    </section>
  )
}
