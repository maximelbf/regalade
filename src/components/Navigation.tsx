const navigationLinks = [
  { href: '/planner', label: 'Planner' },
  { href: '/recipes', label: 'Recettes' },
  { href: '/healthy', label: 'Sain' },
  { href: '/fast', label: 'Rapide' },
]

export default function Navigation() {
  return (
    <nav className="sticky top-16 z-99 w-full bg-white border-b border-gray-100">
      <div className="w-full px-8 py-4 flex gap-12 items-center">
        {navigationLinks.map((link) => (
          <a 
            key={link.href}
            href={link.href} 
            className="flex items-center gap-2 text-gray-600 font-medium transition-all hover:text-indigo-500 hover:bg-gray-50 px-4 py-2 rounded-lg hover:-translate-y-0.5"
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  )
}
