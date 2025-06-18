
import { useState, useEffect } from 'react';
import { Search, MapPin, Star, Filter, Phone, Mail, Globe, ArrowRight, Users, Shield, Clock, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AuthDialog } from '@/components/AuthDialog';
import { CompanyDialog } from '@/components/CompanyDialog';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Company {
  id: string;
  name: string;
  description: string;
  city: string;
  postal_code: string;
  phone: string;
  email: string;
  website: string;
  verified: boolean;
  mobile_service: boolean;
  price_range: string;
  rating: number;
  review_count: number;
}

const popularCities = [
  'München', 'Berlin', 'Hamburg', 'Köln', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Dortmund'
];

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [sortBy, setSortBy] = useState('distance');
  const [showFilters, setShowFilters] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [companyDialogOpen, setCompanyDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    filterAndSortCompanies();
  }, [companies, searchTerm, sortBy]);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*');
      
      if (error) {
        console.error('Error fetching companies:', error);
        return;
      }

      if (data) {
        setCompanies(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortCompanies = () => {
    let filtered = companies;

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = companies.filter(company => 
        company.city.toLowerCase().includes(searchLower) ||
        company.postal_code.includes(searchTerm.trim()) ||
        company.name.toLowerCase().includes(searchLower)
      );
    }

    // Sortierung
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'price_low':
          const aPriceLength = a.price_range?.length || 0;
          const bPriceLength = b.price_range?.length || 0;
          return aPriceLength - bPriceLength;
        case 'price_high':
          const aPriceLengthHigh = a.price_range?.length || 0;
          const bPriceLengthHigh = b.price_range?.length || 0;
          return bPriceLengthHigh - aPriceLengthHigh;
        case 'distance':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredCompanies(filtered);
  };

  const handleSearch = () => {
    // Search is already handled by useEffect, but we can trigger it manually if needed
    filterAndSortCompanies();
  };

  const handleCityClick = (city: string) => {
    setSearchTerm(city);
  };

  const openAuthDialog = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthDialogOpen(true);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < Math.floor(rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <Car className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-blue-600">KFZ Aufbereitung</h1>
              </div>
              <span className="ml-2 text-sm text-gray-500">Deutschland</span>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Button variant="outline" onClick={() => setCompanyDialogOpen(true)}>
                    Unternehmen eintragen
                  </Button>
                  <Button variant="outline" onClick={signOut}>
                    Abmelden
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => openAuthDialog('signup')}>
                    Für Unternehmen
                  </Button>
                  <Button onClick={() => openAuthDialog('login')}>
                    Anmelden
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white opacity-5 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-white opacity-5 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white opacity-5 rounded-full animate-pulse delay-500"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Deutschlands größte
            <span className="block text-blue-200">KFZ-Aufbereitungs</span>
            <span className="block">Plattform</span>
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Finden Sie den perfekten Aufbereiter in Ihrer Nähe. Über {companies.length} geprüfte Betriebe, 
            faire Preise und echte Bewertungen helfen Ihnen bei der Auswahl.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-2xl">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
                <Input 
                  placeholder="PLZ oder Stadt eingeben (z.B. 80331 München)"
                  className="pl-12 h-14 text-lg border-0 shadow-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button 
                className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-lg font-semibold"
                onClick={handleSearch}
                disabled={loading}
              >
                <Search className="w-5 h-5 mr-2" />
                {loading ? 'Suche...' : 'Suchen'}
              </Button>
            </div>
            
            {/* Popular Cities */}
            <div className="mt-4 text-left">
              <p className="text-sm text-gray-600 mb-2">Beliebte Städte:</p>
              <div className="flex flex-wrap gap-2">
                {popularCities.map(city => (
                  <button
                    key={city}
                    onClick={() => handleCityClick(city)}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-blue-50 text-gray-700 rounded-full transition-colors"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-200">{companies.length}+</div>
              <div className="text-sm text-blue-100">Aufbereiter</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-200">50k+</div>
              <div className="text-sm text-blue-100">Zufriedene Kunden</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-200">100%</div>
              <div className="text-sm text-blue-100">Kostenlos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-200">4.8/5</div>
              <div className="text-sm text-blue-100">Ø Bewertung</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Warum KFZ Aufbereitung Deutschland?
            </h3>
            <p className="text-lg text-gray-600">
              Die Vorteile unserer Plattform auf einen Blick
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-blue-50">
              <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">Geprüfte Betriebe</h4>
              <p className="text-gray-600">Alle Aufbereiter werden von uns verifiziert und regelmäßig überprüft.</p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-green-50">
              <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">Echte Bewertungen</h4>
              <p className="text-gray-600">Transparente Bewertungen von echten Kunden helfen bei der Entscheidung.</p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-purple-50">
              <Clock className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">Schnelle Buchung</h4>
              <p className="text-gray-600">Direkte Kontaktaufnahme und schnelle Terminvereinbarung möglich.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search Results */}
      {(searchTerm || companies.length > 0) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <span className="text-gray-600">
                {filteredCompanies.length} Aufbereiter {searchTerm ? `in "${searchTerm}"` : ''} gefunden
              </span>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distance">Nach Entfernung</SelectItem>
                <SelectItem value="rating">Nach Bewertung</SelectItem>
                <SelectItem value="price_low">Preis: niedrig → hoch</SelectItem>
                <SelectItem value="price_high">Preis: hoch → niedrig</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Lade Aufbereiter...</p>
            </div>
          ) : (
            <>
              {/* Company List */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCompanies.map(company => (
                  <Card key={company.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold">{company.name}</h3>
                            {company.verified && (
                              <Badge className="bg-green-100 text-green-800 text-xs">Verifiziert</Badge>
                            )}
                          </div>
                          <p className="text-gray-600 flex items-center text-sm">
                            <MapPin className="w-3 h-3 mr-1" />
                            {company.city} ({company.postal_code})
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center mb-1">
                            {renderStars(company.rating || 0)}
                            <span className="ml-1 text-sm font-semibold">{company.rating || '0.0'}</span>
                          </div>
                          <p className="text-xs text-gray-600">({company.review_count || 0} Bewertungen)</p>
                        </div>
                      </div>
                      
                      {company.description && (
                        <p className="text-gray-700 text-sm mb-3 line-clamp-2">{company.description}</p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg font-bold text-blue-600">{company.price_range || '€'}</span>
                          {company.mobile_service && (
                            <Badge variant="outline" className="text-xs">Mobil</Badge>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">Details</Button>
                          <Button size="sm">Anfragen</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredCompanies.length === 0 && searchTerm && !loading && (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">Keine Aufbereiter in "{searchTerm}" gefunden.</p>
                  <p className="text-gray-500 mt-2">Versuchen Sie es mit einer anderen Stadt oder PLZ.</p>
                </div>
              )}
            </>
          )}
        </section>
      )}

      {/* Call to Action for Companies */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-4">Sie sind KFZ-Aufbereiter?</h3>
          <p className="text-xl text-blue-100 mb-8">
            Registrieren Sie Ihr Unternehmen kostenlos und erreichen Sie tausende neue Kunden.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white text-blue-600 hover:bg-blue-50"
              onClick={() => openAuthDialog('signup')}
            >
              Kostenlos registrieren
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Mehr erfahren
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Car className="h-6 w-6" />
                <span className="text-lg font-bold">KFZ Aufbereitung</span>
              </div>
              <p className="text-gray-400 text-sm">
                Deutschlands führende Plattform für professionelle Fahrzeugaufbereitung.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Für Kunden</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Aufbereiter finden</li>
                <li>Bewertungen lesen</li>
                <li>Preise vergleichen</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Für Unternehmen</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Kostenlos registrieren</li>
                <li>Kunden gewinnen</li>
                <li>Bewertungen sammeln</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Kontakt</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>info@kfz-aufbereitung.de</li>
                <li>+49 (0) 123 456 789</li>
                <li>Impressum & Datenschutz</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            © 2024 KFZ Aufbereitung Deutschland. Alle Rechte vorbehalten.
          </div>
        </div>
      </footer>

      {/* Dialogs */}
      <AuthDialog 
        open={authDialogOpen} 
        onOpenChange={setAuthDialogOpen}
        defaultMode={authMode}
      />
      <CompanyDialog 
        open={companyDialogOpen} 
        onOpenChange={setCompanyDialogOpen}
        onCompanyAdded={fetchCompanies}
      />
    </div>
  );
};

export default Index;
