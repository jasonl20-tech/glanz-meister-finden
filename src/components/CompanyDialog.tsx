
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CompanyDialog = ({ open, onOpenChange }: CompanyDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    postal_code: '',
    phone: '',
    email: '',
    website: '',
    mobile_service: false,
    price_range: '€€'
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);

    try {
      const { error } = await supabase
        .from('companies')
        .insert([{
          ...formData,
          user_id: user.id
        }]);

      if (error) {
        toast({
          title: "Fehler",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Unternehmen erfolgreich registriert",
          description: "Ihr Unternehmen wurde erfolgreich hinzugefügt."
        });
        onOpenChange(false);
        setFormData({
          name: '',
          description: '',
          address: '',
          city: '',
          postal_code: '',
          phone: '',
          email: '',
          website: '',
          mobile_service: false,
          price_range: '€€'
        });
      }
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Unternehmen registrieren</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Firmenname *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Beschreibung</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Beschreiben Sie Ihr Unternehmen..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Adresse *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postal_code">PLZ *</Label>
              <Input
                id="postal_code"
                value={formData.postal_code}
                onChange={(e) => setFormData({...formData, postal_code: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Stadt *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label>Preisniveau</Label>
              <Select value={formData.price_range} onValueChange={(value) => setFormData({...formData, price_range: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="€">€ - Günstig</SelectItem>
                  <SelectItem value="€€">€€ - Mittel</SelectItem>
                  <SelectItem value="€€€">€€€ - Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="mobile_service"
              checked={formData.mobile_service}
              onCheckedChange={(checked) => setFormData({...formData, mobile_service: !!checked})}
            />
            <Label htmlFor="mobile_service">Mobiler Service angeboten</Label>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Wird registriert...' : 'Unternehmen registrieren'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
