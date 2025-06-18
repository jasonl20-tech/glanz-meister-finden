
import { useState } from 'react';
import { Search, MapPin, Star, Filter, Phone, Mail, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Mock data für KFZ-Aufbereitungsbetriebe
const mockCompanies = [
  {
    id: 1,
    name: "AutoGlanz Premium",
    location: "München",
    distance: "2.3 km",
    rating: 4.8,
    reviews: 156,
    services: ["Innenreinigung", "Lackaufbereitung", "Nanoversiegelung"],
    priceRange: "€€€",
    image: "/placeholder.svg",
    verified: true,
    mobile: true,
    description: "Professionelle Fahrzeugaufbereitung seit 2015. Spezialisiert auf Premiumfahrzeuge.",
    phone: "+49 89 123456",
    email: "info@autoglanz-premium.de",
    website: "www.autoglanz-premium.de"
  },
  {
    id: 2,
    name: "Shine & Clean",
    location: "München",
    distance: "4.1 km",
    rating: 4.6,
    reviews: 89,
    services: ["Innenreinigung", "Polsterreinigung", "Felgenreinigung"],
    priceRange: "€€",
    image: "/placeholder.svg",
    verified: true,
    mobile: false,
    description: "Ihr Partner für saubere Fahrzeuge. Faire Preise, top Qualität.",
    phone: "+49 89 234567",
    email: "kontakt@shine-clean.de",
    website: "www.shine-clean.de"
  },
  {
    id: 3,
    name: "Mobile Car Care",
    location: "München",
    distance: "1.8 km",
    rating: 4.9,
    reviews: 203,
    services: ["Mobile Aufbereitung", "Vor-Ort-Service", "Lackpflege"],
    priceRange: "€€€",
    image: "/placeholder.svg",
    verified: true,
    mobile: true,
    description: "Mobile Fahrzeugaufbereitung direkt bei Ihnen vor Ort. 7 Tage die Woche verfügbar.",
    phone: "+49 89 345678",
    email: "service@mobile-carcare.de",
    website: "www.mobile-carcare.de"
  }
];

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const services = ["Innenreinigung", "Lackaufbereitung", "Nanoversiegelung", "Polsterreinigung", "Felgenreinigung", "Mobile Aufbereitung"];
  const priceRanges = ["€", "€€", "€€€"];

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">KFZ Aufbereitung</h1>
              <span className="ml-2 text-sm text-gray-500">Deutschland</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">Für Unternehmen</Button>
              <Button>Registrieren</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Finden Sie den besten KFZ-Aufbereiter in Ihrer Nähe
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Professionelle Fahrzeugaufbereitung • Geprüfte Betriebe • Faire Preise
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto bg-white p-4 rounded-lg shadow-lg">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <Input 
                  placeholder="PLZ oder Ort eingeben (z.B. 80331 München)"
                  className="pl-10 h-12"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button className="h-12 px-8 bg-blue-600 hover:bg-blue-700">
                <Search className="w-5 h-5 mr-2" />
                Suchen
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <span className="text-gray-600">{mockCompanies.length} Aufbereiter gefunden</span>
          </div>
          <select className="border rounded-md px-3 py-2">
            <option>Sortieren nach Entfernung</option>
            <option>Sortieren nach Bewertung</option>
            <option>Sortieren nach Preis</option>
          </select>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Leistungen</h3>
                  <div className="space-y-2">
                    {services.map(service => (
                      <label key={service} className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="mr-2"
                          checked={selectedFilters.includes(service)}
                          onChange={() => toggleFilter(service)}
                        />
                        {service}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Preisniveau</h3>
                  <div className="space-y-2">
                    {priceRanges.map(range => (
                      <label key={range} className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="mr-2"
                          checked={selectedFilters.includes(range)}
                          onChange={() => toggleFilter(range)}
                        />
                        {range}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Optionen</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Nur mobile Aufbereiter
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Nur verifizierte Betriebe
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Sofortige Verfügbarkeit
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Results */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Company List */}
          <div className="lg:col-span-2 space-y-6">
            {mockCompanies.map(company => (
              <Card key={company.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <img 
                      src={company.image} 
                      alt={company.name}
                      className="w-full md:w-48 h-48 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-semibold">{company.name}</h3>
                            {company.verified && (
                              <Badge className="bg-green-100 text-green-800">Verifiziert</Badge>
                            )}
                            {company.mobile && (
                              <Badge className="bg-blue-100 text-blue-800">Mobiler Service</Badge>
                            )}
                          </div>
                          <p className="text-gray-600 flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {company.location} • {company.distance}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center mb-1">
                            {renderStars(company.rating)}
                            <span className="ml-2 font-semibold">{company.rating}</span>
                          </div>
                          <p className="text-sm text-gray-600">({company.reviews} Bewertungen)</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{company.description}</p>
                      
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Leistungen:</h4>
                        <div className="flex flex-wrap gap-2">
                          {company.services.map(service => (
                            <Badge key={service} variant="outline">{service}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Phone className="w-4 h-4 mr-1" />
                            {company.phone}
                          </span>
                          <span className="flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            {company.email}
                          </span>
                          <span className="flex items-center">
                            <Globe className="w-4 h-4 mr-1" />
                            {company.website}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline">Details</Button>
                          <Button>Anfrage senden</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Map Placeholder */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Karte</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-600">Kartenansicht wird hier angezeigt</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
