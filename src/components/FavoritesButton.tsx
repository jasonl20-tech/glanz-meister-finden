
import { useState } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

interface FavoritesButtonProps {
  companyId: string
  companyName: string
}

export function FavoritesButton({ companyId, companyName }: FavoritesButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const { toast } = useToast()

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    
    // Store in localStorage for now (später kann das in die Datenbank)
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    
    if (!isFavorite) {
      favorites.push(companyId)
      toast({
        title: "Zu Favoriten hinzugefügt",
        description: `${companyName} wurde zu Ihren Favoriten hinzugefügt.`
      })
    } else {
      const index = favorites.indexOf(companyId)
      if (index > -1) favorites.splice(index, 1)
      toast({
        title: "Aus Favoriten entfernt",
        description: `${companyName} wurde aus Ihren Favoriten entfernt.`
      })
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleFavorite}
      className="transition-all duration-200 hover:scale-105"
    >
      <Heart 
        className={`h-4 w-4 transition-all duration-200 ${
          isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'
        }`} 
      />
    </Button>
  )
}
