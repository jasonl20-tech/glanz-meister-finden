
import { useState } from 'react'
import { Filter, X, Star, MapPin, Clock, Euro } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface AdvancedFiltersProps {
  onFiltersChange: (filters: any) => void
}

export function AdvancedFilters({ onFiltersChange }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState({
    minRating: [0],
    maxDistance: [50],
    priceRange: [],
    verifiedOnly: false,
    mobileService: false,
    hasWebsite: false,
    hasPhone: false
  })

  const updateFilters = (newFilters: any) => {
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const defaultFilters = {
      minRating: [0],
      maxDistance: [50],
      priceRange: [],
      verifiedOnly: false,
      mobileService: false,
      hasWebsite: false,
      hasPhone: false
    }
    updateFilters(defaultFilters)
  }

  const activeFiltersCount = 
    (filters.minRating[0] > 0 ? 1 : 0) +
    (filters.maxDistance[0] < 50 ? 1 : 0) +
    filters.priceRange.length +
    (filters.verifiedOnly ? 1 : 0) +
    (filters.mobileService ? 1 : 0) +
    (filters.hasWebsite ? 1 : 0) +
    (filters.hasPhone ? 1 : 0)

  if (!isOpen) {
    return (
      <Button 
        variant="outline" 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <Filter className="w-4 h-4" />
        Erweiterte Filter
        {activeFiltersCount > 0 && (
          <Badge variant="secondary" className="ml-1">
            {activeFiltersCount}
          </Badge>
        )}
      </Button>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Erweiterte Filter</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Zurücksetzen
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mindestbewertung */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <label className="text-sm font-medium">
              Mindestbewertung: {filters.minRating[0]} Sterne
            </label>
          </div>
          <Slider
            value={filters.minRating}
            onValueChange={(value) => updateFilters({...filters, minRating: value})}
            max={5}
            min={0}
            step={0.5}
            className="w-full"
          />
        </div>

        {/* Maximale Entfernung */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-500" />
            <label className="text-sm font-medium">
              Max. Entfernung: {filters.maxDistance[0]} km
            </label>
          </div>
          <Slider
            value={filters.maxDistance}
            onValueChange={(value) => updateFilters({...filters, maxDistance: value})}
            max={100}
            min={1}
            step={1}
            className="w-full"
          />
        </div>

        {/* Preisniveau */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Euro className="w-4 h-4 text-green-500" />
            <label className="text-sm font-medium">Preisniveau</label>
          </div>
          <div className="flex gap-2">
            {['€', '€€', '€€€'].map((price) => (
              <Button
                key={price}
                variant={filters.priceRange.includes(price) ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  const newPriceRange = filters.priceRange.includes(price)
                    ? filters.priceRange.filter(p => p !== price)
                    : [...filters.priceRange, price]
                  updateFilters({...filters, priceRange: newPriceRange})
                }}
              >
                {price}
              </Button>
            ))}
          </div>
        </div>

        {/* Checkboxen für weitere Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Weitere Optionen</label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="verified"
                checked={filters.verifiedOnly}
                onCheckedChange={(checked) => 
                  updateFilters({...filters, verifiedOnly: !!checked})
                }
              />
              <label htmlFor="verified" className="text-sm">Nur verifizierte Unternehmen</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="mobile"
                checked={filters.mobileService}
                onCheckedChange={(checked) => 
                  updateFilters({...filters, mobileService: !!checked})
                }
              />
              <label htmlFor="mobile" className="text-sm">Mobiler Service verfügbar</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="website"
                checked={filters.hasWebsite}
                onCheckedChange={(checked) => 
                  updateFilters({...filters, hasWebsite: !!checked})
                }
              />
              <label htmlFor="website" className="text-sm">Website vorhanden</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="phone"
                checked={filters.hasPhone}
                onCheckedChange={(checked) => 
                  updateFilters({...filters, hasPhone: !!checked})
                }
              />
              <label htmlFor="phone" className="text-sm">Telefonnummer vorhanden</label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
