import React from 'react';
import { Heart, ArrowLeft, Trash2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useFavorites } from '@/hooks/useFavorites';
import { useListings } from '@/hooks/useListings';
import { useToast } from '@/hooks/use-toast';

const SubscriberFavorites = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { favorites, removeFavorite, loading: favoritesLoading } = useFavorites();
  const { listings, loading: listingsLoading } = useListings();

  const favoriteListings = listings.filter(listing => favorites.includes(listing.id));

  const handleRemoveFavorite = async (listingId) => {
    try {
      await removeFavorite(listingId);
      toast({
        title: 'Removed',
        description: 'Listing removed from favorites',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove from favorites',
        variant: 'destructive',
      });
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const loading = favoritesLoading || listingsLoading;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Heart className="h-6 w-6 text-destructive" />
              My Favorites
            </h1>
            <p className="text-muted-foreground">
              {favoriteListings.length} {favoriteListings.length === 1 ? 'listing' : 'listings'} saved
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : favoriteListings.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Heart className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No favorites yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Start adding listings to your favorites to track them here.
              </p>
              <Button onClick={() => navigate('/')}>Browse Listings</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {favoriteListings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-48 h-32 sm:h-auto">
                      <img
                        src={listing.image_listing || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop'}
                        alt={listing.address}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">{listing.address}</h3>
                          <p className="text-xl font-bold text-primary">
                            {formatPrice(listing.current_price)}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                            <span>{listing.bedrooms} beds</span>
                            <span>{listing.bathrooms} baths</span>
                            <span>{listing.square_footage}</span>
                          </div>
                          {listing.sale_date && (
                            <span className="inline-block mt-2 px-2 py-1 text-xs rounded-full bg-accent/20 text-accent">
                              Sold
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => navigate(`/details/${listing.id}`)}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleRemoveFavorite(listing.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriberFavorites;
