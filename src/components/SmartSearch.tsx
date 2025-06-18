
import { useState, useEffect } from 'react'
import { Search, MapPin, Clock, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface SmartSearchProps {
  onSearch: (term: string) => void
  loading?: boolean
}

export function SmartSearch({ onSearch, loading }: SmartSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const popularCities = [
    'München', 'Berlin', 'Hamburg', 'Köln', 'Frankfurt', 'Stuttgart', 
    'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig', 'Bremen', 'Dresden'
  ]

  const autoCompleteSuggestions = [
    'Autoaufbereitung München',
    'Fahrzeugaufbereitung Berlin',
    'Innenraumreinigung Hamburg',
    'Lackaufbereitung Köln',
    'Polsterreinigung Frankfurt',
    'Nano-Versiegelung Stuttgart'
  ]

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    if (searchTerm.length > 2) {
      const filtered = [
        ...popularCities.filter(city => 
          city.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        ...autoCompleteSuggestions.filter(suggestion => 
          suggestion.toLowerCase().includes(searchTerm.toLowerCase())
        )
      ].slice(0, 5)
      setSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }, [searchTerm])

  const handleSearch = (term: string = searchTerm) => {
    if (term.trim()) {
      onSearch(term)
      
      // Zu letzten Suchen hinzufügen
      const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5)
      setRecentSearches(updated)
      localStorage.setItem('recentSearches', JSON.stringify(updated))
      
      setShowSuggestions(false)
    }
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div className="relative">
        <MapPin className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
        <Input 
          placeholder="PLZ, Stadt oder Service eingeben (z.B. 80331 München, Lackaufbereitung)"
          className="pl-12 h-14 text-lg border-0 shadow-lg focus:ring-2 focus:ring-blue-500 bg-white/95 backdrop-blur-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          onFocus={() => setShowSuggestions(true)}
        />
        <Button 
          className="absolute right-2 top-2 h-10 px-6 bg-blue-600 hover:bg-blue-700 transition-all duration-200"
          onClick={() => handleSearch()}
          disabled={loading}
        >
          <Search className="w-5 h-5 mr-2" />
          {loading ? 'Suche...' : 'Suchen'}
        </Button>
      </div>

      {/* Vorschläge Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl">
          <div className="p-2">
            <p className="text-xs text-gray-500 mb-2 px-2">Vorschläge</p>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm"
                onClick={() => {
                  setSearchTerm(suggestion)
                  handleSearch(suggestion)
                }}
              >
                <Search className="w-3 h-3 mr-2 inline text-gray-400" />
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Letzte Suchen und beliebte Städte */}
      <div className="mt-4 space-y-3">
        {recentSearches.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Letzte Suchen:
              </p>
              <Button variant="ghost" size="sm" onClick={clearRecentSearches}>
                <X className="w-3 h-3" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                  onClick={() => handleSearch(search)}
                >
                  {search}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Beliebte Städte:</p>
          <div className="flex flex-wrap gap-2">
            {popularCities.slice(0, 8).map(city => (
              <button
                key={city}
                onClick={() => handleSearch(city)}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900 text-gray-700 dark:text-gray-300 rounded-full transition-colors"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
