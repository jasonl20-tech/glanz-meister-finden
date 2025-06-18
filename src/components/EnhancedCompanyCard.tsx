
import { MapPin, Star, Phone, Mail, Globe, Car } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FavoritesButton } from './FavoritesButton'

interface Company {
  id: string
  name: string
  description: string
  city: string
  postal_code: string
  phone: string
  email: string
  website: string
  verified: boolean
  mobile_service: boolean
  price_range: string
  rating: number
  review_count: number
}

interface EnhancedCompanyCardProps {
  company: Company
}

export function EnhancedCompanyCard({ company }: EnhancedCompanyCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 transition-all duration-200 ${
          i < Math.floor(rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`} 
      />
    ))
  }

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors duration-200">
                {company.name}
              </h3>
              {company.verified && (
                <Badge className="bg-green-100 text-green-800 text-xs animate-pulse">
                  ✓ Verifiziert
                </Badge>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-400 flex items-center text-sm">
              <MapPin className="w-3 h-3 mr-1" />
              {company.city} ({company.postal_code})
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="flex items-center mb-1">
                {renderStars(company.rating || 0)}
                <span className="ml-1 text-sm font-semibold">{company.rating || '0.0'}</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                ({company.review_count || 0} Bewertungen)
              </p>
            </div>
            <FavoritesButton companyId={company.id} companyName={company.name} />
          </div>
        </div>
        
        {company.description && (
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed">
            {company.description}
          </p>
        )}
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-lg font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
              {company.price_range || '€'}
            </span>
            {company.mobile_service && (
              <Badge variant="outline" className="text-xs bg-purple-50 dark:bg-purple-900/20 border-purple-200">
                <Car className="w-3 h-3 mr-1" />
                Mobil
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          {company.phone && (
            <Button variant="outline" size="sm" className="flex-1">
              <Phone className="w-3 h-3 mr-1" />
              Anrufen
            </Button>
          )}
          {company.email && (
            <Button variant="outline" size="sm" className="flex-1">
              <Mail className="w-3 h-3 mr-1" />
              E-Mail
            </Button>
          )}
          {company.website && (
            <Button variant="outline" size="sm" className="flex-1">
              <Globe className="w-3 h-3 mr-1" />
              Website
            </Button>
          )}
        </div>

        <div className="flex space-x-2">
          <Button size="sm" variant="outline" className="flex-1 hover:bg-blue-50 dark:hover:bg-blue-900/20">
            Details
          </Button>
          <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
            Anfragen
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
